type ToolAdSlotProps = {
  label?: string;
  className?: string;
};

function ToolAdSlot({ label = 'Ad Slot', className = '' }: ToolAdSlotProps) {
  return (
    <aside
      className={`panel rounded-xl px-5 py-6 text-center ${className}`.trim()}
      aria-label={label}
    >
      {/* Mount the production ad unit here for tool pages. */}
      <p className="section-label">{label}</p>
      <p className="mt-3 text-sm leading-6 text-text-body">
        Advertising supports Spatialdom tools so they can stay available to users at no direct cost.
      </p>
    </aside>
  );
}

export default ToolAdSlot;
