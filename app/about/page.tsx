import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getContentData } from "@/lib/api/content";

export const metadata = {
  title: "关于我 | Allen Lu",
  description: "Allen Lu 的个人介绍",
};

export default async function AboutPage() {
  let aboutContent;
  
  try {
    const content = await getContentData();
    aboutContent = content.about;
  } catch (error) {
    console.error('Failed to load about content:', error);
    return (
      <Container className="pb-[64px]">
        <div className="text-center text-[var(--text-muted)] py-[64px]">
          <p>加载失败，请刷新页面重试</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pb-[64px]">
      <div className="py-[40px] pb-[24px]">
        <h1 className="text-[32px] md:text-[40px] leading-[1.15] font-bold tracking-[-0.02em] mb-2">
          {aboutContent.page.title}
        </h1>
        <p className="text-[var(--text-muted)]">{aboutContent.page.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-base p-6">
          <h3 className="text-[20px] font-bold mb-2">一句话介绍</h3>
          <p className="text-[14px] text-[var(--text-muted)]">
            {aboutContent.intro.summary}
          </p>
          <hr className="my-[18px] border-t border-[var(--border)]" />
          <h3 className="text-[20px] font-bold mb-2">工作方式</h3>
          <ul className="list-disc pl-[18px] text-[var(--text-muted)] space-y-1">
            {aboutContent.intro.workStyle.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="card-base p-6">
          <h3 className="text-[20px] font-bold mb-2">经历时间线</h3>
          <div className="grid gap-[12px]">
            {aboutContent.timeline.map((item, index) => (
              <div key={index} className="p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--bg-muted)] text-[14px]">
                <b>{item.period}</b>
                {item.company && <> · {item.company}</>}
                <br/>
                <span className="text-[var(--text-muted)]">{item.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Section className="pt-[48px]">
        <div className="mb-8 grid gap-2">
          <h2 className="text-[28px] leading-[1.15] font-bold m-0">{aboutContent.methodology.title}</h2>
          <p className="text-[var(--text-muted)] max-w-[70ch] m-0">
            {aboutContent.methodology.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aboutContent.methodology.items.map((item, index) => (
            <div key={index} className="card-base p-6">
              <h3 className="text-[20px] font-bold mb-2">{item.title}</h3>
              <p className="text-[14px] text-[var(--text-muted)]">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </Container>
  );
}
