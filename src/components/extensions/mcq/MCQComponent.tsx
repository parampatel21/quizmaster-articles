import React, { useEffect, useContext } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import * as Icons from "@/components/ui/Icons";
import { EditorModeContext } from "@/context/EditorModeContext";
import { useMCQSelection } from "@/context/MCQSelectionContext";
import MCQInstructorView from "./MCQInstructorView";
import MCQReaderView from "./MCQReaderView";
import { MCQAttributes } from "@/types/mcqTypes";

const MCQComponent = (props: NodeViewProps) => {
  const { node, updateAttributes, deleteNode, editor } = props;
  const attrs = node.attrs as MCQAttributes;
  const { id, isFinalized } = attrs;
  const { isInstructor, setAllMCQsFinalized } = useContext(EditorModeContext);
  const { selectedMCQId, setSelectedMCQId } = useMCQSelection();
  const isSelected = selectedMCQId === id;

  useEffect(() => {
    setAllMCQsFinalized(isFinalized);
  }, [isFinalized, setAllMCQsFinalized]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        isSelected &&
        ["Delete", "Backspace"].includes(e.key) &&
        !(target instanceof HTMLInputElement)
      ) {
        e.preventDefault();
        if (id) {
          await deleteMCQFromDatabase(id);
        }
        deleteNode();
        setSelectedMCQId(null);
        editor?.commands.focus();
      } else if (
        isSelected &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        setSelectedMCQId(null);
        editor?.commands.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".mcq-wrapper")) {
        setSelectedMCQId(null);
        editor?.commands.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelected, deleteNode, editor, id, setSelectedMCQId]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !(
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLButtonElement
      )
    ) {
      e.preventDefault();
      e.stopPropagation();
      setSelectedMCQId(id);
      editor?.commands.blur();
    }
  };

  const deleteMCQFromDatabase = async (mcqId: string) => {
    try {
      const response = await fetch(`api/mcq/${mcqId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete MCQ: ${response.statusText}`);
      }

      console.log("MCQ deleted successfully");
    } catch (error) {
      console.error("Error deleting MCQ:", error);
    }
  };

  return (
    <NodeViewWrapper
      className={`mcq-wrapper border p-4 rounded-lg select-none ${
        isSelected && isInstructor
          ? "border-success border-2"
          : "border-base-300"
      }`}
      contentEditable={false}
      draggable={isInstructor ? "true" : "false"}
      onClick={isInstructor ? handleClick : undefined}
    >
      <div className="p-2 bg-base-200 rounded-md shadow mb-4 flex items-center gap-2">
        <Icons.CircleHelp className="w-6 h-6" />
        <h3 className="font-thin text-gray-800">Multiple Choice Question</h3>
      </div>

      {isInstructor ? (
        <MCQInstructorView attrs={attrs} updateAttributes={updateAttributes} />
      ) : (
        <MCQReaderView attrs={attrs} />
      )}
    </NodeViewWrapper>
  );
};

export default MCQComponent;
