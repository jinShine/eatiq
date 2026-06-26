"use client";

import { useEffect, useState } from "react";

import { uniqueId } from "lodash-es";
import { Plus, X } from "lucide-react";

import { VStack } from "../Container";
import { Button } from "../button";
import Input, { type InputProps } from "./Input";

interface Tag {
  id: string;
  value: string;
}

type TagInputProps = Omit<InputProps, "onChange"> & {
  values?: string[];
  onChangeTags: (values: string[]) => void;
};

export default function TagInput({ values = [], onChangeTags, ...props }: TagInputProps) {
  // ** States
  const [_values, setValues] = useState<Tag[]>(values.map(v => ({ id: uniqueId(), value: v })));
  const [inputValue, setInputValue] = useState("");

  // ** Handlers
  const handleAdd = () => {
    if (!inputValue.trim()) {
      return;
    }

    inputValue
      .trim()
      .split(",")
      .forEach(v => {
        const isDuplicate = _values.some(tag => tag.value === v.trim());
        if (isDuplicate) {
          return;
        }

        setValues(prev => [...prev, { id: uniqueId(), value: v.trim() }]);
      });

    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleDelete = (id: string) => {
    setValues(prev => prev.filter(tag => tag.id !== id));
  };

  useEffect(() => {
    onChangeTags?.(_values.map(tag => tag.value));
  }, [_values]);

  return (
    <VStack className="">
      <Input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        endAdornment={
          <Button
            type="button"
            size={"minimal"}
            variant={"ghost"}
            className="bg-primary hover:bg-primary/80 w-6 h-6"
            onClick={handleAdd}
          >
            <Plus className="text-white" />
          </Button>
        }
        onKeyDown={handleKeyDown}
        {...props}
      />
      <div className="flex flex-wrap gap-2 mt-3">
        {_values.map(tag => (
          <div
            key={tag.id}
            className="flex items-center gap-1 px-2 py-1 bg-primary-background border border-blue-200 rounded-full"
          >
            <span className="text-xs text-primary">{tag.value}</span>
            <button
              type="button"
              onClick={() => handleDelete(tag.id)}
              className="text-primary transition-all hover:scale-120 cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </VStack>
  );
}
