"use client";

import { useRouter } from "next/navigation";

import { CircleAlert, LogIn, MailCheck, UserRoundCheck } from "lucide-react";

import { Button, SpinLoader, Toast } from "@components/ui";

import { useAuthUser } from "@services/api/auth/auth.query";
import { inviteReturnStorage } from "@services/api/auth/invite-return-storage";
import { useInvitedWorkspaces, useRespondInviteMutation } from "@services/api/workspace/workspace.query";
import { tokenStorage } from "@services/token-storage";

import ROUTES from "@constants/routes";

import InviteCard from "../_components/InviteCard";

type InviteContainerProps = {
  workspaceId: string;
  email: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

export default function InviteContainer({ workspaceId, email }: InviteContainerProps) {
  const router = useRouter();

  const me = useAuthUser();
  const isLoggedIn = Boolean(me);
  const isSameAccount = isLoggedIn && normalize(me?.email ?? "") === normalize(email);

  // 초대가 아직 유효한지 서버에 물어본다. 목록에 없으면 이미 처리됐거나 취소된 것이다.
  // 로그인 전에는 부를 수 없으므로 그때는 이름 없이 안내만 한다
  const { data, isLoading, isError } = useInvitedWorkspaces(isSameAccount);
  const { mutate: respond, isPending } = useRespondInviteMutation(workspaceId);

  const invited = data?.workspaces.find(workspace => String(workspace.uid) === workspaceId);

  const handleGoLogin = () => {
    // 로그인 메일은 대개 새 탭에서 열린다. 돌아올 곳을 남겨두지 않으면 초대가 끊긴다
    inviteReturnStorage.set(
      `${ROUTES.WORKSPACE.INVITE}?workspace_uid=${workspaceId}&email=${encodeURIComponent(email)}`,
    );
    router.push(`${ROUTES.AUTH.SIGN_IN}?email=${encodeURIComponent(email)}`);
  };

  const handleSwitchAccount = () => {
    inviteReturnStorage.set(
      `${ROUTES.WORKSPACE.INVITE}?workspace_uid=${workspaceId}&email=${encodeURIComponent(email)}`,
    );
    tokenStorage.clear();
    router.push(`${ROUTES.AUTH.SIGN_IN}?email=${encodeURIComponent(email)}`);
  };

  const handleRespond = (action: "수락" | "거절") => {
    respond(
      { action },
      {
        onSuccess: response => {
          if (action === "거절") {
            Toast.success("초대를 거절했어요.");
            router.replace(ROUTES.ROOT);
            return;
          }

          Toast.success(`${response.workspace_name} 워크스페이스에 참여했어요.`);
          router.replace(`/${response.workspace_uid}/dashboard`);
        },
        // 서버가 준 문구를 그대로 보여준다. "이미 멤버입니다" 같은 안내가 훨씬 정확하다
        onError: error => Toast.error(error.message || "초대 처리에 실패했어요."),
      },
    );
  };

  if (!workspaceId || !email) {
    return (
      <InviteCard
        icon={CircleAlert}
        tone="warning"
        title="잘못된 초대 링크예요"
        description={
          <>
            링크가 온전하지 않습니다.
            <br />
            받으신 메일의 링크를 다시 눌러주세요.
          </>
        }
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <InviteCard
        icon={MailCheck}
        title="워크스페이스에 초대받으셨어요"
        description={
          <>
            <span className="text-text-primary font-semibold">{email}</span> 로 초대되었습니다.
            <br />
            로그인하면 초대를 수락할 수 있어요.
          </>
        }
      >
        <Button onClick={handleGoLogin}>로그인하고 수락하기</Button>
      </InviteCard>
    );
  }

  if (!isSameAccount) {
    return (
      <InviteCard
        icon={CircleAlert}
        tone="warning"
        title="다른 계정으로 로그인되어 있어요"
        description={
          <>
            초대는 <span className="text-text-primary font-semibold">{email}</span> 로 왔는데
            <br />
            지금은 <span className="text-text-primary font-semibold">{me?.email}</span> 로 로그인되어 있어요.
          </>
        }
      >
        <Button onClick={handleSwitchAccount}>
          <LogIn className="size-4" />
          초대받은 계정으로 로그인
        </Button>
        <Button variant="ghost" onClick={() => router.replace(ROUTES.ROOT)}>
          내 워크스페이스로 가기
        </Button>
      </InviteCard>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <SpinLoader className="text-text-disabled" />
      </div>
    );
  }

  // 조회가 실패했다고 수락을 막지 않는다. 서버가 잠깐 불안정할 때 초대를 못 받게 된다
  if (!invited && !isError) {
    return (
      <InviteCard
        icon={CircleAlert}
        tone="warning"
        title="이미 처리된 초대예요"
        description={
          <>
            수락했거나 만료된 초대입니다.
            <br />
            이미 참여 중이라면 워크스페이스에서 확인할 수 있어요.
          </>
        }
      >
        <Button onClick={() => router.replace(ROUTES.ROOT)}>내 워크스페이스로 가기</Button>
      </InviteCard>
    );
  }

  return (
    <InviteCard
      icon={UserRoundCheck}
      title={invited ? `${invited.name} 워크스페이스에 초대받으셨어요` : "워크스페이스에 초대받으셨어요"}
      description={
        <>
          수락하면 바로 함께 일할 수 있어요.
          <br />
          거절하면 이 초대는 사라집니다.
        </>
      }
    >
      <Button isLoading={isPending} onClick={() => handleRespond("수락")}>
        수락하기
      </Button>
      <Button variant="ghost" disabled={isPending} onClick={() => handleRespond("거절")}>
        거절하기
      </Button>
    </InviteCard>
  );
}
