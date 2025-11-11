"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useJobStore } from "@/store/job-store"
import { X } from "lucide-react"

export function JobFilters() {
  const { filters, setFilters, searchJobs } = useJobStore()
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleApplyFilters = () => {
    setFilters(localFilters)
    searchJobs("", localFilters, true)
  }

  const handleClearFilters = () => {
    const emptyFilters = {}
    setLocalFilters(emptyFilters)
    setFilters(emptyFilters)
    searchJobs("", emptyFilters, true)
  }

  const jobTypes = [
    { value: "FULL_TIME", label: "Tiempo completo" },
    { value: "PART_TIME", label: "Medio tiempo" },
    { value: "CONTRACT", label: "Contrato" },
    { value: "INTERNSHIP", label: "Prácticas" },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              placeholder="Ciudad, país..."
              value={localFilters.location || ""}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <Label>Tipo de empleo</Label>
            <Select value={localFilters.type || ""} onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            <Label htmlFor="salaryMin">Salario mínimo</Label>
            <Input
              id="salaryMin"
              type="number"
              placeholder="0"
              value={localFilters.salaryMin || ""}
              onChange={(e) => handleFilterChange("salaryMin", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryMax">Salario máximo</Label>
            <Input
              id="salaryMax"
              type="number"
              placeholder="100000"
              value={localFilters.salaryMax || ""}
              onChange={(e) => handleFilterChange("salaryMax", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
          <Button onClick={handleApplyFilters}>Aplicar filtros</Button>
        </div>
      </CardContent>
    </Card>
  )
}
