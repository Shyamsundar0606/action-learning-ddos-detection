import {
  IconTableDashed,
  IconProtocol,
  IconZoomCode,
  IconSettings,
  IconSparkles
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconTableDashed,
    href: "/",
  },
  {
    id: uniqueId(),
    title: "Rulesets",
    icon: IconProtocol,
    href: "/rulesets",
  },
  {
    id: uniqueId(),
    title: "Inspect",
    icon: IconZoomCode,
    href: "/inspect",
  },
  {
    id: uniqueId(),
    title: "Artifical Intelligence",
    icon: IconSparkles,
    href: "/ai",
  },
  {
    id: uniqueId(),
    title: "Settings",
    icon: IconSettings,
    href: "/settings",
  }
];

export default Menuitems;


