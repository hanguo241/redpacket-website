export default function AppLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#ebebeb] border-t-[#FF37C7] animate-spin" />
        <p className="text-sm text-[#808080]">加载中...</p>
      </div>
    </div>
  );
}
