import CompanySettingsSkeleton from "./_components/CompanySettingsSkeleton";

/** 서버에서는 워크스페이스 종류(브랜드/바이어)를 몰라 탭 없이 섹션 골격만 보여준다 */
export default function CompanySettingsLoading() {
  return <CompanySettingsSkeleton />;
}
