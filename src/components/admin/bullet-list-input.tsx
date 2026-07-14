"use client";

import { useState } from "react";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";

const inputClass =
  "flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100";

export function BulletListInput({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string[];
}) {
  const [items, setItems] = useState<string[]>(
    defaultValue && defaultValue.length > 0 ? defaultValue : [""],
  );

  function updateItem(index: number, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, ""]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            name={name}
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            className={inputClass}
            placeholder={`Bullet ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="p-1.5 text-neutral-400 hover:text-red-600"
            aria-label="Remove bullet"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        <Plus size={14} />
        Add bullet
      </button>
    </div>
  );
}
