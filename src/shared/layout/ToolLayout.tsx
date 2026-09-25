import type { PropsWithChildren } from 'react';
import Container from '../../components/layout/Container';
import ToolAdSlot from '../ads/ToolAdSlot';

type ToolLayoutProps = PropsWithChildren<{
  title: string;
  intro: string;
  showAds?: boolean;
  compact?: boolean;
}>;

function ToolLayout({ title, intro, children, showAds = false, compact = false }: ToolLayoutProps) {
  return (
    <main className="pb-16 pt-32 sm:pt-36">
      <Container>
        <div className="space-y-8">
          <header className={compact ? 'max-w-3xl border-b border-border-subtle pb-5' : 'panel rounded-xl p-6 sm:p-8'}>
            <div className={compact ? 'space-y-2' : 'max-w-3xl space-y-4'}>
              <p className="section-label">Spatialdom Tools</p>
              <h1 className={compact ? 'text-2xl font-bold tracking-tight text-text-primary sm:text-4xl' : 'text-3xl font-bold tracking-tight text-text-primary sm:text-4xl'}>{title}</h1>
              <p className="text-sm leading-7 text-text-body sm:text-base">{intro}</p>
            </div>
          </header>

          {showAds ? (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)_180px] lg:items-start">
                <div className="hidden lg:block lg:sticky lg:top-28">
                  <ToolAdSlot label="Left Banner" className="min-h-[520px]" />
                </div>

                <div>{children}</div>

                <div className="hidden lg:block lg:sticky lg:top-28">
                  <ToolAdSlot label="Right Banner" className="min-h-[520px]" />
                </div>
              </div>

              <ToolAdSlot label="Bottom Banner" />
            </div>
          ) : (
            <div>{children}</div>
          )}
        </div>
      </Container>
    </main>
  );
}

export default ToolLayout;
