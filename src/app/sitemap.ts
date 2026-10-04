import { MetadataRoute } from 'next'
import { getPortfolioData } from '@/lib/markdown'
import { getAllNotes } from '@/lib/notes'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.odaidh.dev'
  const portfolioData = await getPortfolioData()

  // Main homepage
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ]

  // Individual project pages
  const projectPages = portfolioData.projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.date ? new Date(project.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Notes (drafts are excluded in production by getAllNotes)
  const notes = getAllNotes()
  const notePages = notes.length
    ? [
        { url: `${baseUrl}/notes`, lastModified: new Date(notes[0].date), changeFrequency: 'monthly' as const, priority: 0.6 },
        ...notes.map((note) => ({
          url: `${baseUrl}/notes/${note.slug}`,
          lastModified: new Date(note.date),
          changeFrequency: 'yearly' as const,
          priority: 0.6,
        })),
      ]
    : []

  return [...staticPages, ...projectPages, ...notePages]
}