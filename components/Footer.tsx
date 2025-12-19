export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-[40px] text-[14px] text-[var(--text-muted)]">
      <div className="container-custom flex flex-wrap justify-between gap-4">
        <div>&copy; {new Date().getFullYear()} Allen Lu · 极简商务作品集原型</div>
        <div>邮箱：you@example.com · GitHub：github.com/yourname · 微信：yourwechat</div>
      </div>
    </footer>
  );
}
