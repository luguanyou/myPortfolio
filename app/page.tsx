import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { getContentData } from "@/lib/api/content";
import { getProjects } from "@/lib/api/data";

export default async function Home() {
  // 获取首页内容
  let homeContent;
  let featuredProjects = [];
  
  try {
    const content = await getContentData();
    homeContent = content.home;
    
    // 获取精选项目数据
    const allProjects = await getProjects();
    featuredProjects = homeContent.featuredProjects.projectSlugs
      .map(slug => allProjects.find(p => p.slug === slug))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
  } catch (error) {
    console.error('Failed to load home content:', error);
    return (
      <Container className="py-[64px]">
        <div className="text-center text-[var(--text-muted)]">
          <p>加载失败，请刷新页面重试</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Section className="pt-[64px] pb-[48px]">
        <Container className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-[40px] items-center">
          <div>
            <h1 className="text-[32px] md:text-[40px] leading-[1.15] font-bold tracking-[-0.02em] mb-4 text-[var(--text)]">
              {homeContent.hero.title}
            </h1>
            <p className="text-[18px] text-[var(--text-muted)] mb-6 max-w-[70ch]">
              {homeContent.hero.description}
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {homeContent.hero.ctas.map((cta) => (
                <Button key={cta.href} asChild variant={cta.variant}>
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {homeContent.kpis.map((kpi, index) => (
                <div key={index} className="card-base p-4">
                  <strong className="block text-[18px] mb-1">{kpi.value}</strong>
                  <span className="text-[12px] text-[var(--text-muted)]">{kpi.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Media Placeholder */}
          <div className="border border-dashed border-[var(--border-strong)] bg-gradient-to-b from-[var(--bg-muted)] to-white rounded-[var(--radius-lg)] h-[280px] grid place-items-center text-[var(--text-muted)]">
            {homeContent.hero.mediaPlaceholder || '右侧媒体位'}
          </div>
        </Container>
      </Section>

      {/* Core Advantages */}
      <Section className="py-[48px]">
        <Container>
          <div className="mb-8 grid gap-2">
            <h2 className="text-[28px] leading-[1.15] font-bold m-0">{homeContent.advantages.title}</h2>
            <p className="text-[var(--text-muted)] max-w-[70ch] m-0">
              {homeContent.advantages.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeContent.advantages.items.map((item, index) => (
              <div key={index} className="card-base card-hover p-6">
                <h3 className="text-[20px] font-bold mb-2">{item.title}</h3>
                <p className="text-[14px] text-[var(--text-muted)]">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured Projects */}
      <Section id="projects" className="py-[48px] bg-[var(--bg-muted)]">
        <Container>
          <div className="mb-8 grid gap-2">
            <h2 className="text-[28px] leading-[1.15] font-bold m-0">{homeContent.featuredProjects.title}</h2>
            <p className="text-[var(--text-muted)] max-w-[70ch] m-0">
              {homeContent.featuredProjects.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                href={`/projects/${project.slug}`}
                title={project.title}
                description={project.description}
                tags={project.tags}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Tech Stack */}
      <Section className="py-[48px]">
        <Container>
          <div className="mb-8 grid gap-2">
            <h2 className="text-[28px] leading-[1.15] font-bold m-0">{homeContent.techStack.title}</h2>
            <p className="text-[var(--text-muted)] max-w-[70ch] m-0">
              {homeContent.techStack.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {homeContent.techStack.categories.map((category, index) => (
              <div key={index} className="card-base p-6">
                <h3 className="text-[20px] font-bold mb-2">{category.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
