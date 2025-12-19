'use client';

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function ResumePage() {
  return (
    <Container className="pb-[64px]">
      <div className="py-[40px] pb-[24px]">
        <h1 className="text-[32px] md:text-[40px] leading-[1.15] font-bold tracking-[-0.02em] mb-2">简历</h1>
        <p className="text-[var(--text-muted)]">这里先用“简历摘要 + 下载按钮”。正式版可替换为 PDF 预览或在线简历模块。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-base p-6">
          <h3 className="text-[20px] font-bold mb-2">快速摘要</h3>
          <ul className="list-disc pl-[18px] text-[var(--text-muted)] space-y-1 mb-4">
            <li>主栈：TypeScript / React / Vue / Next.js</li>
            <li>方向：可视化、Three.js、数字孪生</li>
            <li>工程化：组件化、性能优化、规范化交付</li>
            <li>AI：RAG/Agent/工具链实践（占位）</li>
          </ul>
          <div className="flex gap-3 flex-wrap mt-4">
            <Button variant="primary" onClick={() => alert('占位：后续替换为真实 PDF 下载')}>
              下载 PDF
            </Button>
            <Button variant="default" onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText('you@example.com');
                alert('已复制邮箱（占位）');
              }
            }}>
              复制邮箱
            </Button>
          </div>
        </div>
        <div className="card-base p-6">
          <h3 className="text-[20px] font-bold mb-2">简历预览位</h3>
          <div className="border border-dashed border-[var(--border-strong)] bg-gradient-to-b from-[var(--bg-muted)] to-white rounded-[var(--radius-lg)] h-[340px] grid place-items-center text-[var(--text-muted)]">
            PDF 预览/截图占位
          </div>
        </div>
      </div>
    </Container>
  );
}
