import { BasicEditor } from "@/components/BasicEditor";

export default function Home() {
  return (
    <div className="flex justify-center min-h-screen"> {/* Adjust the background color here */}
      <div className="w-3/5 bg-white p-6"> {/* Center and size the editor */}
        <BasicEditor />
      </div>
    </div>
  );
}
