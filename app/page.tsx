import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ProjectCard } from "@/components/ui/ProjectCard";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Section className="pt-[64px] pb-[48px]">
        <Container className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-[40px] items-center">
          <div>
            <h1 className="text-[32px] md:text-[40px] leading-[1.15] font-bold tracking-[-0.02em] mb-4 text-[var(--text)]">
              前端工程师｜可视化/Three.js｜AI 应用
            </h1>
            <p className="text-[18px] text-[var(--text-muted)] mb-6 max-w-[70ch]">
              专注复杂交互与可视化系统的工程交付：结构清晰、性能可控、组件可复用，并善用 AI 工具链提升研发效率。
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Button asChild variant="primary">
                <Link href="/projects">查看项目</Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/resume">下载简历</Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/contact">联系我</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="card-base p-4">
                <strong className="block text-[18px] mb-1">4+ 年</strong>
                <span className="text-[12px] text-[var(--text-muted)]">前端工程经验</span>
              </div>
              <div className="card-base p-4">
                <strong className="block text-[18px] mb-1">可视化/三维</strong>
                <span className="text-[12px] text-[var(--text-muted)]">数字孪生项目交付</span>
              </div>
              <div className="card-base p-4">
                <strong className="block text-[18px] mb-1">AI 提效</strong>
                <span className="text-[12px] text-[var(--text-muted)]">工具链/智能功能探索</span>
              </div>
            </div>
          </div>
          
          {/* Media Placeholder */}
          <div className="border border-dashed border-[var(--border-strong)] bg-gradient-to-b from-[var(--bg-muted)] to-white rounded-[var(--radius-lg)] h-[280px] grid place-items-center text-[var(--text-muted)]">
            右侧媒体位（项目截图 / 3D 场景截帧 / Demo 视频占位）
          </div>
        </Container>
      </Section>

      {/* Core Advantages */}
      <Section className="py-[48px]">
        <Container>
          <div className="mb-8 grid gap-2">
            <h2 className="text-[28px] leading-[1.15] font-bold m-0">核心优势</h2>
            <p className="text-[var(--text-muted)] max-w-[70ch] m-0">
              面试官最关心的三件事：你能不能做复杂事、怎么做、做出来效果如何。以下模块都是为“快速判断”设计。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-base card-hover p-6">
              <h3 className="text-[20px] font-bold mb-2">可视化与三维交互</h3>
              <p className="text-[14px] text-[var(--text-muted)]">Three.js / WebGL / 场景交互 / 动画 / 选中高亮 / 相机控制 / 资源加载优化。</p>
            </div>
            <div className="card-base card-hover p-6">
              <h3 className="text-[20px] font-bold mb-2">工程化与性能</h3>
              <p className="text-[14px] text-[var(--text-muted)]">组件化沉淀、状态管理、请求与缓存、性能指标与优化策略（首屏、FPS、资源体积）。</p>
            </div>
            <div className="card-base card-hover p-6">
              <h3 className="text-[20px] font-bold mb-2">AI 应用与提效</h3>
              <p className="text-[14px] text-[var(--text-muted)]">RAG/Agent/自动化脚手架/文档与代码生成流程；把“会用”变成“能交付”。</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Featured Projects */}
      <Section id="projects" className="py-[48px] bg-[var(--bg-muted)]">
        <Container>
          <div className="mb-8 grid gap-2">
            <h2 className="text-[28px] leading-[1.15] font-bold m-0">精选项目</h2>
            <p className="text-[var(--text-muted)] max-w-[70ch] m-0">
              每个项目都按“背景 → 职责 → 难点 → 方案 → 结果”组织，便于你在面试中复述。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
              href="/projects/smart-warehouse"
              title="智能仓储数字孪生平台"
              description="三维场景 + 实时数据联动，支持设备状态与货物流转动画。"
              tags={["Three.js", "WebGL", "性能优化"]}
            />
            <ProjectCard
              href="/projects/airport-system"
              title="机场行李分拣管理系统"
              description="复杂表格与业务流程、权限、监控看板与异常处理。"
              tags={["React/Vue", "组件库", "权限"]}
            />
            <ProjectCard
              href="/projects/ai-toolchain"
              title="AI 辅助知识检索/工具链"
              description="把文档、项目经验、代码片段变成可检索的知识库与回答助手。"
              tags={["RAG", "Node/Python", "Prompt"]}
            />
          </div>
        </Container>
      </Section>

      {/* Tech Stack */}
      <Section className="py-[48px]">
        <Container>
          <div className="mb-8 grid gap-2">
            <h2 className="text-[28px] leading-[1.15] font-bold m-0">技术栈与工具</h2>
            <p className="text-[var(--text-muted)] max-w-[70ch] m-0">
              强调“能落地”的技术组合：前端主栈 + 可视化 + 工程化 + 最小后端 + AI 工具链。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-base p-6">
              <h3 className="text-[20px] font-bold mb-2">前端</h3>
              <div className="flex flex-wrap gap-2">
                {["TypeScript", "React", "Vue 3", "Next.js", "Vite", "状态管理", "测试/规范"].map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
            <div className="card-base p-6">
              <h3 className="text-[20px] font-bold mb-2">可视化 / 三维</h3>
              <div className="flex flex-wrap gap-2">
                {["Three.js", "WebGL", "ECharts", "GSAP", "模型加载", "性能优化"].map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
            <div className="card-base p-6">
              <h3 className="text-[20px] font-bold mb-2">后端 / 部署</h3>
              <div className="flex flex-wrap gap-2">
                {["Node.js", "API", "Nginx", "Vercel", "CI/CD"].map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
            <div className="card-base p-6">
              <h3 className="text-[20px] font-bold mb-2">AI 工具链</h3>
              <div className="flex flex-wrap gap-2">
                {["Prompt", "RAG", "Agent", "自动化脚手架", "文档生成"].map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
