// did not decide to abstract this into another page since interactive articles problem scope can be provided within one page

import { BasicEditor } from "@/components/editor/BasicEditor";
import Header from "@/components/ui/header/Header";
import { EditorModeProvider } from "@/context/EditorModeContext";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

export default function Home() {
  return (
    <EditorModeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Suspense fallback={<SkeletonLoader />}>
          <div className="flex justify-center flex-1 mt-12 overflow-y-auto">
            <div className="w-1/2 p-6 h-full">
              <ErrorBoundary>
                <BasicEditor />
              </ErrorBoundary>
            </div>
          </div>
        </Suspense>
      </div>
    </EditorModeProvider>
  );
}
