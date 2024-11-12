import { useState } from 'react'
import { Download, Upload, RotateCcw, Database } from 'lucide-react'
import { db } from '../services/db'

export function DatabasePanel() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const exportData = {
        pageContents: await db.pageContents.toArray(),
        sidebarConfig: await db.sidebarConfig.toArray(),
        siteContent: await db.siteContent.toArray()
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `r00kdoc-backup-${new Date().toISOString()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export database')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsImporting(true)
      const text = await file.text()
      const importData = JSON.parse(text)

      // Validate the import data structure
      if (!importData.pageContents || !importData.sidebarConfig || !importData.siteContent) {
        throw new Error('Invalid backup file format')
      }

      // Clear existing data
      await db.clearAllData()

      // Import the data
      await Promise.all([
        ...importData.pageContents.map((page: any) => db.pageContents.put(page)),
        ...importData.sidebarConfig.map((config: any) => db.sidebarConfig.put(config)),
        ...importData.siteContent.map((content: any) => db.siteContent.put(content))
      ])

      // Reload the page to reflect changes
      window.location.reload()
    } catch (error) {
      console.error('Import failed:', error)
      alert('Failed to import database')
    } finally {
      setIsImporting(false)
    }
  }

  const handleRestore = async () => {
    if (!window.confirm('Are you sure you want to restore the database to its default state? This action cannot be undone.')) {
      return
    }

    try {
      setIsRestoring(true)
      await db.clearAllData()
      // The database will automatically reinitialize with default data
      // due to the 'ready' event handler in db.ts
      window.location.reload()
    } catch (error) {
      console.error('Restore failed:', error)
      alert('Failed to restore database')
    } finally {
      setIsRestoring(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Database Management</h2>
        <Database className="h-6 w-6 text-muted-foreground" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col items-center space-y-2">
            <Download className="h-6 w-6 mb-2 text-blue-600" />
            <h3 className="text-lg font-semibold">Export Database</h3>
            <p className="text-sm text-muted-foreground text-center">
              Download a backup of all your documentation data
            </p>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2"
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col items-center space-y-2">
            <Upload className="h-6 w-6 mb-2 text-green-600" />
            <h3 className="text-lg font-semibold">Import Database</h3>
            <p className="text-sm text-muted-foreground text-center">
              Restore from a previously exported backup file
            </p>
            <label className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-9 px-4 py-2 cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="hidden"
              />
              {isImporting ? 'Importing...' : 'Import'}
            </label>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col items-center space-y-2">
            <RotateCcw className="h-6 w-6 mb-2 text-red-600" />
            <h3 className="text-lg font-semibold">Restore Defaults</h3>
            <p className="text-sm text-muted-foreground text-center">
              Reset the database to its initial state
            </p>
            <button
              onClick={handleRestore}
              disabled={isRestoring}
              className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-9 px-4 py-2"
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Database Information</h3>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            The database stores all your documentation content, including pages, sections, topics, 
            and their descriptions. Use the controls above to manage your data:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
            <li>Export: Create a backup of your current database state</li>
            <li>Import: Restore from a previously exported backup file</li>
            <li>Restore: Reset to the default documentation structure</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
