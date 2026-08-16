export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-brand-900">About Garbtopia</h1>
      <p className="text-brand-700 mt-4 leading-relaxed">
        Garbtopia lets you browse traditional cultural costumes from around the world, overlay
        them on a frontal photo, and save the result — no photo-editing skills required. Pick a
        demo photo or upload your own, try a costume, and keep the looks you love in your
        gallery.
      </p>
      <p className="text-brand-700 mt-4 leading-relaxed">
        v1 uses static frontal overlays (no AI segmentation yet) across three categories: Asian,
        African, and Indigenous Americas. More cultures, better fit, and social sharing are on
        the roadmap.
      </p>
    </div>
  );
}
