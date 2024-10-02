import { BasicEditor } from "@/components/editor/BasicEditor";

export default function Home() {
  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-3/5 bg-white p-6">
        <BasicEditor />
      </div>
    </div>
  );
}
