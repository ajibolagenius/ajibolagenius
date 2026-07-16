import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getResourceConfig, type FieldConfig } from "@/lib/admin-resources";
import { listTechLogos, type TechLogoOption } from "@/lib/tech-logos";
import { BulletListInput } from "@/components/admin/bullet-list-input";
import { createResourceRow, deleteResourceRow, updateResourceRow } from "./actions";

const inputClass =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100";

function FieldInput({
  field,
  defaultValue,
  techLogos,
}: {
  field: FieldConfig;
  defaultValue?: unknown;
  techLogos: TechLogoOption[];
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        name={field.name}
        rows={2}
        defaultValue={String(defaultValue ?? "")}
        className={`${inputClass} w-full`}
      />
    );
  }
  if (field.type === "boolean") {
    return (
      <input
        type="checkbox"
        name={field.name}
        defaultChecked={Boolean(defaultValue)}
      />
    );
  }
  if (field.type === "list") {
    return (
      <BulletListInput
        name={field.name}
        defaultValue={Array.isArray(defaultValue) ? defaultValue : undefined}
      />
    );
  }
  if (field.type === "image") {
    const current = defaultValue ? String(defaultValue) : "";
    return (
      <div className="flex items-start gap-3">
        {current && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current}
            alt=""
            className="h-12 w-12 rounded-full object-cover"
          />
        )}
        <div className="flex w-full flex-col gap-1.5">
          <input
            type="file"
            name={`${field.name}__file`}
            accept="image/*"
            className={`${inputClass} w-full`}
          />
          <input
            type="text"
            name={field.name}
            defaultValue={current}
            placeholder="…or paste an image URL (clear to use the default)"
            className={`${inputClass} w-full`}
          />
        </div>
      </div>
    );
  }
  if (field.type === "icon") {
    const current = defaultValue ? String(defaultValue) : "";
    return (
      <div className="flex items-center gap-2">
        {current && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt="" className="h-8 w-8 object-contain" />
        )}
        <select
          name={field.name}
          defaultValue={current}
          className={`${inputClass} w-full`}
        >
          <option value="">No icon</option>
          {techLogos.map((logo) => (
            <option key={logo.url} value={logo.url}>
              {logo.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <input
      type={field.type === "number" ? "number" : "text"}
      name={field.name}
      defaultValue={
        defaultValue === undefined || defaultValue === null
          ? ""
          : String(defaultValue)
      }
      className={`${inputClass} w-full`}
    />
  );
}

export default async function ManageResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  const config = getResourceConfig(resource);
  if (!config) notFound();

  const supabase = await createClient();
  const needsIconPicker = config.fields.some((f) => f.type === "icon");
  const [{ data: rows, error }, techLogos] = await Promise.all([
    supabase
      .from(config.table)
      .select("*")
      .order(config.orderColumn, { ascending: true }),
    needsIconPicker ? listTechLogos() : Promise.resolve([]),
  ]);

  const isFixed = Boolean(config.fixedRows);
  const idColumn = config.idColumn ?? "id";

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-neutral-500 underline">
            &larr; Admin
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">{config.label}</h1>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error.message}</p>}

      <div className="flex flex-col gap-6">
        {rows?.map((row: Record<string, unknown>) => (
          <form
            key={String(row[idColumn])}
            action={async (formData: FormData) => {
              "use server";
              await updateResourceRow(
                resource,
                row[idColumn] as string,
                formData,
              );
            }}
            className="flex flex-col gap-3 rounded-md border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500">
                {String(row[config.titleField] ?? row[idColumn])}
              </p>
              {!isFixed && (
                <button
                  type="submit"
                  formAction={async () => {
                    "use server";
                    await deleteResourceRow(resource, row[idColumn] as string);
                  }}
                  className="text-sm text-red-600 underline"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {config.fields.map((field) => (
                <label
                  key={field.name}
                  className={`flex flex-col gap-1 text-xs font-medium ${
                    field.type === "textarea" ||
                    field.type === "list" ||
                    field.type === "icon"
                      ? "col-span-2"
                      : ""
                  }`}
                >
                  {field.label}
                  <FieldInput
                    field={field}
                    defaultValue={row[field.name]}
                    techLogos={techLogos}
                  />
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="mt-1 self-start rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
            >
              Save
            </button>
          </form>
        ))}
      </div>

      {!isFixed && (
        <form
          action={async (formData: FormData) => {
            "use server";
            await createResourceRow(resource, formData);
          }}
          className="mt-8 flex flex-col gap-3 rounded-md border border-dashed border-neutral-300 p-4 dark:border-neutral-700"
        >
          <p className="text-sm font-medium text-neutral-500">
            New {config.label.toLowerCase()} entry
          </p>
          <div className="grid grid-cols-2 gap-3">
            {config.fields.map((field) => (
              <label
                key={field.name}
                className={`flex flex-col gap-1 text-xs font-medium ${
                  field.type === "textarea" ||
                  field.type === "list" ||
                  field.type === "icon"
                    ? "col-span-2"
                    : ""
                }`}
              >
                {field.label}
                <FieldInput field={field} techLogos={techLogos} />
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="mt-1 self-start rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            Create
          </button>
        </form>
      )}
    </main>
  );
}
