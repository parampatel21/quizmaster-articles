import { BasicEditor } from "@/components/editor/BasicEditor";
import Header from "@/components/ui/Header";
import { EditorModeProvider } from "@/context/EditorModeContext"; // Wrap with Provider

export default function Home() {
  return (
    <EditorModeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex justify-center flex-1 mt-12 overflow-y-auto">
          <div className="w-3/5 p-6 h-full">
            <BasicEditor />
          </div>
        </div>
      </div>
    </EditorModeProvider>
  );
}
