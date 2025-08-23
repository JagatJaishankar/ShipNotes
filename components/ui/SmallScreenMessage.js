// Component to show message on small screens directing users to larger screens
export default function SmallScreenMessage() {
  return (
    <div className="sm:hidden fixed inset-0 bg-base-100 z-50 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">📱</div>
        <h1 className="font-raleway font-extrabold text-2xl tracking-tighter mb-4 lowercase">
          desktop experience only
        </h1>
        <p className="font-lora tracking-wide opacity-80 text-neutral mb-6 lowercase">
          shipnotes works best on larger screens. please switch to a desktop or tablet to continue.
        </p>
        <div className="border-1 border-neutral rounded-sm p-4 bg-base-200">
          <p className="font-space text-xs tracking-normal opacity-60 lowercase">
            minimum screen width: 640px
          </p>
        </div>
      </div>
    </div>
  );
}