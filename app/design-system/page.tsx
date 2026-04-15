import { DsButtons } from "@/components/design-system/DsButtons";
import { DsCards } from "@/components/design-system/DsCards";
import { DsChefFab } from "@/components/design-system/DsChefFab";
import { DsEmpty } from "@/components/design-system/DsEmpty";
import { DsFeedback } from "@/components/design-system/DsFeedback";
import { DsForms } from "@/components/design-system/DsForms";
import { DsHero } from "@/components/design-system/DsHero";
import { DsInventory } from "@/components/design-system/DsInventory";
import { DsSideNav } from "@/components/design-system/DsSideNav";
import { DsTopBar } from "@/components/design-system/DsTopBar";
import { DsProjectReference } from "@/components/design-system/DsProjectReference";
import { DsTypography } from "@/components/design-system/DsTypography";
import { Tabs, TabList, TabPanel, TabTrigger } from "@/components/ui/Tabs";

export const metadata = {
  title: "Design System",
};

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface [color-scheme:light]">
      <DsTopBar />
      <div className="flex">
        <DsSideNav />
        <main className="max-w-7xl flex-1 space-y-24 p-8 md:ml-64 md:p-12">
          <DsHero />
          <section className="rounded-lg bg-surface-container-lowest p-6 shadow-sm md:hidden">
            <p className="mb-3 text-sm font-bold text-on-surface">Sections</p>
            <Tabs defaultValue="typography">
              <TabList>
                <TabTrigger value="typography">Type</TabTrigger>
                <TabTrigger value="buttons">Buttons</TabTrigger>
                <TabTrigger value="forms">Forms</TabTrigger>
                <TabTrigger value="tables">Tables</TabTrigger>
                <TabTrigger value="feedback">Feedback</TabTrigger>
                <TabTrigger value="tokens">Tokens</TabTrigger>
              </TabList>
              <TabPanel value="typography">
                <a className="text-primary underline" href="#typography">
                  Jump to typography
                </a>
              </TabPanel>
              <TabPanel value="buttons">
                <a className="text-primary underline" href="#buttons">
                  Jump to buttons
                </a>
              </TabPanel>
              <TabPanel value="forms">
                <a className="text-primary underline" href="#forms">
                  Jump to forms
                </a>
              </TabPanel>
              <TabPanel value="tables">
                <a className="text-primary underline" href="#tables">
                  Jump to tables
                </a>
              </TabPanel>
              <TabPanel value="feedback">
                <a className="text-primary underline" href="#feedback">
                  Jump to feedback
                </a>
              </TabPanel>
              <TabPanel value="tokens">
                <a className="text-primary underline" href="#project-tokens">
                  Jump to tokens
                </a>
              </TabPanel>
            </Tabs>
          </section>
          <DsTypography />
          <DsButtons />
          <DsForms />
          <DsCards />
          <DsInventory />
          <DsFeedback />
          <DsEmpty />
          <DsProjectReference />
        </main>
      </div>
      <DsChefFab />
    </div>
  );
}
