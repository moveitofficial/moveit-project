import { typography } from '@repo/styles/typography';
import { RoundChip } from '@repo/ui/RoundChip';

export default function LoginPage() {
  return (
    <main
      style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}
    >
      <h1 className={typography.f32B}>관리자 로그인 IT</h1>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h3>size: web</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <RoundChip text="white / full" size="web" />
          <RoundChip text="white / half" size="web" opacity="half" />
          <RoundChip text="blue100 / full" size="web" color="blue100" />
          <RoundChip
            text="blue100 / half"
            size="web"
            color="blue100"
            opacity="half"
          />
          <RoundChip text="close" size="web" color="blue100" close />
          <RoundChip
            text="close + half"
            size="web"
            color="blue100"
            opacity="half"
            close
          />
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h3>size: admin (배경색 variant 테스트)</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <RoundChip text="blue100" size="admin" color="blue100" />
          <RoundChip text="blue300" size="admin" color="blue300" />
          <RoundChip text="blue400" size="admin" color="blue400" />
          <RoundChip text="red200" size="admin" color="red200" />
          <RoundChip text="yellow100" size="admin" color="yellow100" />
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h3>size: admin + opacity: half</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <RoundChip
            text="blue300 half"
            size="admin"
            color="blue300"
            opacity="half"
          />
          <RoundChip
            text="red200 half"
            size="admin"
            color="red200"
            opacity="half"
          />
          <RoundChip
            text="yellow100 half"
            size="admin"
            color="yellow100"
            opacity="half"
          />
        </div>
      </section>
    </main>
  );
}
