"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { MarketingCard, SectionHeader } from "@/components/ui/Marketing";

const faqs = [
  {
    q: "用户领红包需要付 gas 吗？",
    a: "不需要。平台提供代领模式，用户无需持有 native token 即可领取红包，真正零门槛。",
  },
  {
    q: "红包资金安全吗？",
    a: "资金锁定在智能合约中，平台只签发领取凭证，不触碰用户资金。即使平台签名私钥泄露，资金也不会丢失。",
  },
  {
    q: "支持哪些 Token？",
    a: "支持所有主流链的 ERC20 / BEP20 / SPL / TRC20 Token，以及各链的 Native Token。",
  },
  {
    q: "没领完的红包怎么办？",
    a: "红包过期后，剩余资金会自动退回发红包人的钱包，平台不会截留。",
  },
  {
    q: "接入需要多长时间？",
    a: "通过 API 接入，最快 30 分钟可完成测试。提供完善的 SDK 和技术文档，开发体验友好。",
  },
  {
    q: "需要自己部署合约吗？",
    a: "完全不需要。合约由 RedPacket 部署和维护，你只需调用 API 即可。",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      <button
        type="button"
        className="flex w-full items-center justify-between border-none bg-transparent py-5 text-left text-base font-medium text-vercel-black transition-colors hover:opacity-60"
        onClick={() => setOpen(!open)}
      >
        <span className="pr-4">{q}</span>
        <svg
          className={cn("h-4 w-4 shrink-0 text-text-tertiary transition-transform", open && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-sm leading-[1.7] text-text-secondary">{a}</div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeader
          title="常见问题"
          description="关于 RedPacket 你可能想了解的"
          className="mb-12"
          descriptionClassName="text-lg"
        />

        <MarketingCard className="px-6 py-0">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </MarketingCard>
      </div>
    </section>
  );
}
