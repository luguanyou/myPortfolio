import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "关于我 | Allen Lu",
  description: "Allen Lu 的个人介绍",
};

export default function AboutPage() {
  return (
    <Container className="pb-[64px]">
      <div className="py-[40px] pb-[24px]">
        <h1 className="text-[32px] md:text-[40px] leading-[1.15] font-bold tracking-[-0.02em] mb-2">关于我</h1>
        <p className="text-[var(--text-muted)]">用结构化叙事建立可信度：我做过什么、怎么做、做出来什么。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-base p-6">
          <h3 className="text-[20px] font-bold mb-2">一句话介绍</h3>
          <p className="text-[14px] text-[var(--text-muted)]">
            前端工程师，擅长可视化/三维交互系统的工程化交付，并探索 AI 应用与研发提效。
          </p>
          <hr className="my-[18px] border-t border-[var(--border)]" />
          <h3 className="text-[20px] font-bold mb-2">工作方式</h3>
          <ul className="list-disc pl-[18px] text-[var(--text-muted)] space-y-1">
            <li>先定义目标指标与约束（性能/稳定/交互）</li>
            <li>拆分模块与数据结构，组件化复用</li>
            <li>用监控与指标迭代优化（首屏/FPS/体积）</li>
          </ul>
        </div>

        <div className="card-base p-6">
          <h3 className="text-[20px] font-bold mb-2">经历时间线（占位）</h3>
          <div className="grid gap-[12px]">
            <div className="p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--bg-muted)] text-[14px]">
              <b>2021 - 至今</b> · 公司 A
              <br/>
              <span className="text-[var(--text-muted)]">数字孪生/可视化项目交付，负责 Three.js 场景与性能优化</span>
            </div>
            <div className="p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--bg-muted)] text-[14px]">
              <b>2019 - 2021</b> · 公司 B
              <br/>
              <span className="text-[var(--text-muted)]">业务系统/平台建设，组件库与工程化实践</span>
            </div>
            <div className="p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--bg-muted)] text-[14px]">
              <b>学习/探索</b>
              <br/>
              <span className="text-[var(--text-muted)]">AI 工具链、RAG/Agent、小型应用实践</span>
            </div>
          </div>
        </div>
      </div>

      <Section className="pt-[48px]">
        <div className="mb-8 grid gap-2">
          <h2 className="text-[28px] leading-[1.15] font-bold m-0">方法论（面试加分点）</h2>
          <p className="text-[var(--text-muted)] max-w-[70ch] m-0">
            把经验沉淀成可复用的套路：需求拆解、数据建模、交互设计、性能策略、上线验证。
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-base p-6">
            <h3 className="text-[20px] font-bold mb-2">工程化</h3>
            <p className="text-[14px] text-[var(--text-muted)]">规范、组件、目录结构、可维护性（占位）</p>
          </div>
          <div className="card-base p-6">
            <h3 className="text-[20px] font-bold mb-2">性能</h3>
            <p className="text-[14px] text-[var(--text-muted)]">渲染与资源策略、监控、优化闭环（占位）</p>
          </div>
          <div className="card-base p-6">
            <h3 className="text-[20px] font-bold mb-2">AI 提效</h3>
            <p className="text-[14px] text-[var(--text-muted)]">文档/代码生成、检索增强、自动化（占位）</p>
          </div>
        </div>
      </Section>
    </Container>
  );
}
