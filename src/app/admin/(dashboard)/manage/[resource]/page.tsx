import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getResourceConfig,
  readFieldValue,
  type FieldConfig,
} from "@/lib/admin-resources";
import { listTechLogos, type TechLogoOption } from "@/lib/tech-logos";
import { BulletListInput } from "@/components/admin/bullet-list-input";
import { ActionForm } from "@/components/admin/action-form";
import { ActionButton } from "@/components/admin/action-button";
import { createResourceRow, deleteResourceRow, updateResourceRow } from "./actions";

const inputClass =
  "rounded-md border border-ink/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent";

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

/** Label + input + optional hint. Shared by the edit and create forms. */
function Field({
  field,
  defaultValue,
  techLogos,
}: {
  field: FieldConfig;
  defaultValue?: unknown;
  techLogos: TechLogoOption[];
}) {
  const wide =
    field.type === "textarea" ||
    field.type === "list" ||
    field.type === "icon" ||
    Boolean(field.help);

  return (
    <label
      className={`flex flex-col gap-1 text-xs font-medium ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      {field.label}
      <FieldInput
        field={field}
        defaultValue={defaultValue}
        techLogos={techLogos}
      />
      {field.help && (
        <span className="font-normal text-ink/50">{field.help}</span>
      )}
    </label>
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
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="mb-8 text-2xl font-semibold">{config.label}</h1>

      {error && <p className="text-sm text-red-600">{error.message}</p>}

      <div className="flex flex-col gap-6">
        {rows?.map((row: Record<string, unknown>) => {
          const title = String(row[config.titleField] ?? row[idColumn]);
          return (
            <ActionForm
              key={String(row[idColumn])}
              action={async (formData: FormData) => {
                "use server";
                return updateResourceRow(
                  resource,
                  row[idColumn] as string,
                  formData,
                );
              }}
              className="rounded-md border border-ink/10 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink/60">{title}</p>
                {!isFixed && (
                  // Outside the submit flow now: it runs its own action and
                  // needs none of the form's fields. It also finally asks
                  // first — deleting a row used to be a single stray click.
                  <ActionButton
                    action={async () => {
                      "use server";
                      return deleteResourceRow(
                        resource,
                        row[idColumn] as string,
                      );
                    }}
                    confirm={`Delete "${title}"? This cannot be undone.`}
                    pendingLabel="Deleting…"
                    className="text-sm text-red-600 underline"
                  >
                    Delete
                  </ActionButton>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {config.fields.map((field) => (
                  <Field
                    key={field.name}
                    field={field}
                    defaultValue={readFieldValue(row, field.name)}
                    techLogos={techLogos}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="mt-1 self-start rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-cream"
              >
                Save
              </button>
            </ActionForm>
          );
        })}
      </div>

      {!isFixed && (
        <ActionForm
          action={async (formData: FormData) => {
            "use server";
            return createResourceRow(resource, formData);
          }}
          resetOnSuccess
          className="mt-8 rounded-md border border-dashed border-ink/20 p-4"
        >
          <p className="text-sm font-medium text-ink/60">
            New {config.label.toLowerCase()} entry
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {config.fields.map((field) => (
              <Field
                key={field.name}
                field={field}
                techLogos={techLogos}
              />
            ))}
          </div>
          <button
            type="submit"
            className="mt-1 self-start rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-cream"
          >
            Create
          </button>
        </ActionForm>
      )}
    </main>
  );
}
