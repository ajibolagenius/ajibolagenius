import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Clock, ImagePlus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import RichTextEditor from '../../components/admin/RichTextEditor';
import Badge from '../../components/portfolio/Badge';
import { BADGE_VARIANTS } from '../../constants';
import SectionKicker from '../../components/portfolio/SectionKicker';
import { adminEndpoints, uploadAssetFile } from '../../services/adminApi';
import { formatBlogReadTimeFromBody } from '../../lib/blogReadTime';

const BLOG_CATEGORIES = [
  'Design', 'Education', 'Engineering', 'Technical',
  'Opinion', 'Tutorial', 'Case Study', 'News',
];

const CATEGORY_NONE = '__none__';

const emptyPost = () => ({
  slug: '', title: '', date: '', tags: [], category: '', excerpt: '',
  body: '', read_time: '', published: true, published_at: '',
  meta_description: '', og_image: '',
});

/** Prose styles matching BlogPostPage.jsx for accurate preview */
const articleProseClass = [
  'article-body font-body text-[16px] leading-[1.8] text-[var(--muted)] max-w-full break-words',
  '[&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-[var(--white)] [&_h1]:mt-12 [&_h1]:mb-6 [&_h1]:tracking-tight',
  '[&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[var(--white)] [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:tracking-tight',
  '[&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--white)] [&_h3]:mt-8 [&_h3]:mb-3',
  '[&_p]:mb-6',
  '[&_ul]:list-none [&_ul]:pl-0 [&_ul]:my-6 [&_ul]:space-y-3 [&_ul]:[&_li]:flex [&_ul]:[&_li]:items-start [&_ul]:[&_li]:gap-3',
  '[&_ol]:list-none [&_ol]:pl-0 [&_ol]:my-6 [&_ol]:space-y-3 [&_ol]:[&_li]:flex [&_ol]:[&_li]:items-start [&_ol]:[&_li]:gap-3',
  '[&_blockquote]:border-l-4 [&_blockquote]:border-[var(--sungold)] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-[var(--white)] [&_blockquote]:bg-[var(--overlay)] [&_blockquote]:py-4 [&_blockquote]:my-8',
  '[&_a]:text-[var(--sungold)] [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-[var(--stardust)] [&_a]:transition-colors',
  '[&_pre]:bg-[var(--surface)] [&_pre]:p-6 [&_pre]:border [&_pre]:border-[var(--border)] [&_pre]:my-8 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_code]:font-mono [&_code]:text-[13px] [&_code]:leading-normal',
].join(' ');

function isHtmlBody(body) {
  if (!body || typeof body !== 'string') return false;
  const t = body.trim();
  return t.startsWith('<') || /<[a-z][\s\S]*>/i.test(t);
}

export default function AdminBlogEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(emptyPost());
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [originalPost, setOriginalPost] = useState(null);
  const [ogImageFile, setOgImageFile] = useState(null);
  const [ogImagePreviewUrl, setOgImagePreviewUrl] = useState(null);
  const [ogImageUploading, setOgImageUploading] = useState(false);
  const ogImageInputRef = React.useRef(null);

  // Load existing post
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    adminEndpoints.blogPosts.list()
      .then((posts) => {
        const found = posts.find((p) => p.id === id);
        if (found) {
          setOriginalPost(found);
          setForm({
            ...found,
            tags: Array.isArray(found.tags) ? found.tags.join(', ') : '',
            published: found.published !== false,
            published_at: found.published_at || '',
            meta_description: found.meta_description ?? '',
            og_image: found.og_image ?? '',
          });
          // Reset local upload state when switching to an existing record.
          setOgImageFile(null);
          setOgImagePreviewUrl(null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    return () => {
      if (ogImagePreviewUrl) {
        try {
          URL.revokeObjectURL(ogImagePreviewUrl);
        } catch (_) {
          // ignore
        }
      }
    };
  }, [ogImagePreviewUrl]);

  const update = (key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === 'body') next.read_time = formatBlogReadTimeFromBody(value);
      return next;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setOgImageUploading(Boolean(ogImageFile));

      const readTime = formatBlogReadTimeFromBody(form.body);
      const tagsArr = typeof form.tags === 'string'
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : form.tags;
      const published = form.published !== false;

      let ogImageUrl = (form.og_image ?? '').trim();
      if (ogImageFile) {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(ogImageFile.type)) {
          throw new Error('OG image must be JPEG/PNG/WebP/GIF.');
        }
        // Upload to public storage, then store its public URL in `blog_posts.og_image`.
        const uploaded = await uploadAssetFile(ogImageFile);
        ogImageUrl = uploaded?.publicUrl || ogImageUrl;
      }

      const payload = {
        ...form,
        tags: tagsArr,
        read_time: readTime,
        published,
        published_at: published && !originalPost?.published_at && !form.published_at
          ? new Date().toISOString()
          : (form.published_at || originalPost?.published_at || null),
        meta_description: form.meta_description ?? '',
        og_image: ogImageUrl ?? '',
      };

      if (isEditing) await adminEndpoints.blogPosts.update(id, payload);
      else await adminEndpoints.blogPosts.create(payload);
      navigate('/admin/blog');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
      setOgImageUploading(false);
    }
  };

  // Preview data
  const previewTags = useMemo(() => {
    if (!form.tags) return [];
    if (Array.isArray(form.tags)) return form.tags;
    return form.tags.split(',').map((t) => t.trim()).filter(Boolean);
  }, [form.tags]);

  const previewReadTime = useMemo(() => formatBlogReadTimeFromBody(form.body), [form.body]);

  if (loading) {
    return (
      <div className="py-32 text-center font-mono text-[13px] text-[var(--subtle)]">
        Loading post…
      </div>
    );
  }

  return (
    <div className="-mx-6 md:-mx-8 -my-8 md:-my-10 flex flex-col" style={{ height: '100vh' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/blog')}
            className="text-[var(--muted)] hover:text-[var(--white)] gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to posts
          </Button>
          <span className="font-display text-sm font-semibold text-[var(--white)]">
            {isEditing ? 'Edit post' : 'New post'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="top-published"
              checked={form.published !== false}
              onCheckedChange={(v) => update('published', v !== false)}
              className="border-[var(--border-md)] data-[state=checked]:bg-[var(--sungold)]"
            />
            <Label htmlFor="top-published" className="font-mono text-[11px] text-[var(--muted)] cursor-pointer">
              Published
            </Label>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[var(--sungold)] text-[var(--void)] font-display font-semibold text-[13px] rounded-none gap-2 hover:shadow-[var(--shadow-sharp-gold)] hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Main content — side by side */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel */}
        <div className="w-1/2 xl:w-[55%] overflow-y-auto border-r border-[var(--border)] p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ed-slug">Slug</Label>
              <Input
                id="ed-slug"
                value={form.slug}
                onChange={(e) => update('slug', e.target.value)}
                placeholder="e.g. my-post → /writing/my-post"
                className="bg-[var(--elevated)] border-[var(--border-md)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ed-date">Date</Label>
              <Input
                id="ed-date"
                type="date"
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                className="bg-[var(--elevated)] border-[var(--border-md)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ed-title">Title</Label>
            <Input
              id="ed-title"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. How I Built X"
              className="bg-[var(--elevated)] border-[var(--border-md)] text-lg font-display"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ed-category">Category</Label>
              <Select
                value={form.category || CATEGORY_NONE}
                onValueChange={(v) => update('category', v === CATEGORY_NONE ? '' : v)}
              >
                <SelectTrigger id="ed-category" className="bg-[var(--elevated)] border-[var(--border-md)] text-[var(--white)]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-[var(--border)] bg-[var(--surface)]">
                  <SelectItem value={CATEGORY_NONE} className="text-[var(--muted)] focus:bg-[var(--elevated)] focus:text-[var(--white)]">— None —</SelectItem>
                  {[...BLOG_CATEGORIES, ...(form.category && !BLOG_CATEGORIES.includes(form.category) ? [form.category] : [])].map((c) => (
                    <SelectItem key={c} value={c} className="text-[var(--white)] focus:bg-[var(--elevated)] focus:text-[var(--white)]">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ed-tags">Tags</Label>
              <Input
                id="ed-tags"
                value={form.tags}
                onChange={(e) => update('tags', e.target.value)}
                placeholder="React, Next.js"
                className="bg-[var(--elevated)] border-[var(--border-md)]"
              />
              <span className="font-mono text-[11px] text-[var(--subtle)]">Separate with commas.</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ed-excerpt">Excerpt</Label>
            <Textarea
              id="ed-excerpt"
              value={form.excerpt}
              onChange={(e) => update('excerpt', e.target.value)}
              rows={2}
              placeholder="Short summary for listing and meta"
              className="bg-[var(--elevated)] border-[var(--border-md)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ed-body">Body</Label>
            <RichTextEditor
              id="ed-body"
              value={form.body}
              onChange={(v) => update('body', v)}
              placeholder="Write your article…"
              className="min-h-[400px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ed-read-time">Read time</Label>
            <Input
              id="ed-read-time"
              value={form.read_time || previewReadTime}
              readOnly
              className="bg-[var(--elevated)] border-[var(--border-md)] cursor-default opacity-90"
            />
            <span className="font-mono text-[11px] text-[var(--subtle)]">Auto-calculated (~200 words/min).</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
            <div className="space-y-2">
              <Label htmlFor="ed-meta-description">Meta description (SEO)</Label>
              <Textarea
                id="ed-meta-description"
                value={form.meta_description || ''}
                onChange={(e) => update('meta_description', e.target.value)}
                rows={2}
                placeholder="Override for search/social; else excerpt used"
                className="bg-[var(--elevated)] border-[var(--border-md)]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="ed-og-image">OG image</Label>
                {ogImageUploading && (
                  <span className="font-mono text-[11px] text-[var(--subtle)]">Uploading…</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  id="ed-og-image"
                  value={form.og_image || ''}
                  onChange={(e) => update('og_image', e.target.value)}
                  placeholder="/og-image.png or full URL"
                  className="bg-[var(--elevated)] border-[var(--border-md)]"
                />

                <input
                  ref={ogImageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
                    if (!allowed.includes(file.type)) return;
                    if (ogImagePreviewUrl) {
                      try {
                        URL.revokeObjectURL(ogImagePreviewUrl);
                      } catch (_) {
                        // ignore
                      }
                    }
                    setOgImageFile(file);
                    setOgImagePreviewUrl(URL.createObjectURL(file));
                    // Do not overwrite the URL field yet; we override on Save.
                  }}
                  className="hidden"
                  aria-label="Upload OG image"
                />

                <div className="flex items-center flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => ogImageInputRef.current?.click()}
                    disabled={saving || ogImageUploading}
                    className="border-[var(--border-md)] text-[var(--white)]"
                  >
                    <ImagePlus className="w-4 h-4 mr-1" aria-hidden />
                    {ogImageFile ? 'Change file' : 'Upload image'}
                  </Button>

                  {ogImageFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setOgImageFile(null);
                        // Allow re-selecting the same file by clearing the underlying input value.
                        if (ogImageInputRef.current) ogImageInputRef.current.value = '';
                        if (ogImagePreviewUrl) {
                          try {
                            URL.revokeObjectURL(ogImagePreviewUrl);
                          } catch (_) {
                            // ignore
                          }
                        }
                        setOgImagePreviewUrl(null);
                      }}
                      disabled={saving || ogImageUploading}
                      className="text-[var(--terracotta)]"
                    >
                      <Trash2 className="w-4 h-4 mr-1" aria-hidden />
                      Remove
                    </Button>
                  )}
                </div>

                {ogImagePreviewUrl && (
                  <div className="border border-[var(--border)] bg-[var(--elevated)] p-2">
                    <img
                      src={ogImagePreviewUrl}
                      alt="OG preview"
                      className="w-full h-auto max-h-[160px] object-contain"
                    />
                  </div>
                )}

                <p className="font-mono text-[11px] text-[var(--subtle)]">
                  Upload overrides the OG URL field on Save.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className="w-1/2 xl:w-[45%] overflow-y-auto bg-[var(--void)]">
          <div className="sticky top-0 z-10 flex items-center gap-2 px-6 py-2 bg-[var(--void)]/90 backdrop-blur border-b border-[var(--border)]">
            <Eye className="w-4 h-4 text-[var(--subtle)]" />
            <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--subtle)]">Live preview</span>
          </div>

          <div className="p-8">
            {/* Category kicker */}
            {form.category && (
              <div className="mb-4">
                <SectionKicker label={form.category} accent="sungold" />
              </div>
            )}

            {/* Title */}
            <h1
              className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] mb-6 text-[var(--white)]"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
            >
              {form.title || 'Untitled post'}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-[var(--border-md)] font-mono text-[11px] text-[var(--subtle)]">
              {form.date && (
                <span className="bg-[var(--overlay)] px-2 py-1 border border-[var(--border)]">
                  {form.date}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-[var(--sungold)]" />
                {previewReadTime}
              </span>
              {form.published === false && (
                <span className="text-[var(--terracotta)] font-semibold">DRAFT</span>
              )}
            </div>

            {/* Tags */}
            {previewTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {previewTags.map((tag, j) => (
                  <Badge key={j} variant={BADGE_VARIANTS[j % BADGE_VARIANTS.length]} className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Excerpt */}
            {form.excerpt && (
              <div className="mb-10 pl-4 border-l-4 border-[var(--sungold)]">
                <p className="font-body text-[17px] leading-[1.75] text-[var(--white)] font-medium">
                  {form.excerpt}
                </p>
              </div>
            )}

            {/* Body */}
            {form.body ? (
              isHtmlBody(form.body) ? (
                <div
                  className={articleProseClass}
                  dangerouslySetInnerHTML={{ __html: form.body }}
                />
              ) : (
                <div className={articleProseClass}>
                  {form.body.split(/\n\n+/).map((block, i) => {
                    const trimmed = block.trim();
                    if (!trimmed) return null;
                    return (
                      <p key={i} className="font-body text-[15px] leading-[1.8] mb-6 text-[var(--muted)]">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              )
            ) : (
              <p className="font-mono text-[13px] text-[var(--subtle)] italic">
                Start writing to see a preview…
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
