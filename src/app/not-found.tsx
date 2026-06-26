"use client";

import Image from "next/image";
import Link from "next/link";

import { Button, Text, VStack } from "@components/ui";

import ROUTES from "@constants/routes";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center py-20 bg-background">
      <Image src="/images/404.svg" alt="404" height={300} width={300} />

      <VStack className="gap-[10px] mt-[20px]">
        <Text variant="lg" className="font-semibold">
          페이지를 찾을 수 없습니다.
        </Text>
        <Text variant="sm">주소가 잘못되었거나 존재하지 않는 페이지입니다.</Text>
        <Button variant={"ghost"}>
          <Link href={ROUTES.ROOT} className="px-4 py-2 rounded-md bg-primary text-white mt-[10px]">
            홈으로 가기
          </Link>
        </Button>
      </VStack>
    </div>
  );
}
