import { withWorkspace } from "@/lib/auth";
import { getDefaultDomainsQuerySchema } from "@/lib/zod/schemas/domains";
import { prisma } from "@dub/prisma";
import { SHORT_DOMAIN } from "@dub/utils";
import { NextResponse } from "next/server";
import * as z from "zod/v4";

// GET /api/domains/default - get default domains
export const GET = withWorkspace(
  async ({ workspace, searchParams }) => {
    const { search } = getDefaultDomainsQuerySchema.parse(searchParams);

    const data = await prisma.defaultDomains.findUnique({
      where: {
        projectId: workspace.id,
      },
      select: {
        rl2me: true,
      },
    });

    let defaultDomains: string[] = [];

    if (data?.rl2me) {
      defaultDomains = [SHORT_DOMAIN];
      if (search && !SHORT_DOMAIN.toLowerCase().includes(search.toLowerCase())) {
        defaultDomains = [];
      }
    }

    return NextResponse.json(defaultDomains);
  },
  {
    requiredPermissions: ["domains.read"],
  },
);

const updateDefaultDomainsSchema = z.object({
  defaultDomains: z.array(z.string()),
});

// PATCH /api/domains/default - edit default domains
export const PATCH = withWorkspace(
  async ({ req, workspace }) => {
    const { defaultDomains } = await updateDefaultDomainsSchema.parseAsync(
      await req.json(),
    );

    const response = await prisma.defaultDomains.update({
      where: {
        projectId: workspace.id,
      },
      data: {
        rl2me: defaultDomains.includes(SHORT_DOMAIN),
      },
    });

    return NextResponse.json(response);
  },
  {
    requiredPermissions: ["domains.write"],
  },
);
