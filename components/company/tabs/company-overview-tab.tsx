"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Company } from "@/lib/types"
import { FiTarget, FiEye, FiHeart, FiAward, FiUsers, FiTrendingUp } from "react-icons/fi"

interface CompanyOverviewTabProps {
  company: Company
  isOwnProfile?: boolean
}

export function CompanyOverviewTab({ company, isOwnProfile }: CompanyOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Description */}
      {company.description && (
        <Card>
          <CardHeader>
            <CardTitle>Sobre la empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{company.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Mission & Vision */}
      {(company.mission || company.vision) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {company.mission && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FiTarget className="h-5 w-5 text-primary" />
                  <span>Misión</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{company.mission}</p>
              </CardContent>
            </Card>
          )}

          {company.vision && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FiEye className="h-5 w-5 text-primary" />
                  <span>Visión</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{company.vision}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Culture */}
      {company.culture && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FiUsers className="h-5 w-5 text-primary" />
              <span>Cultura organizacional</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{company.culture}</p>
          </CardContent>
        </Card>
      )}

      {/* Values */}
      {company.values && company.values.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FiHeart className="h-5 w-5 text-primary" />
              <span>Valores corporativos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {company.values.map((value, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      {company.benefits && company.benefits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FiAward className="h-5 w-5 text-primary" />
              <span>Beneficios</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {company.benefits.map((benefit, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {benefit}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FiTrendingUp className="h-5 w-5 text-primary" />
            <span>Información de la empresa</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {company.employeeCount && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Empleados</p>
                <p className="text-2xl font-bold">{company.employeeCount.toLocaleString()}</p>
              </div>
            )}
            {company.foundedYear && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Año de fundación</p>
                <p className="text-2xl font-bold">{company.foundedYear}</p>
              </div>
            )}
            {company.size && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tamaño</p>
                <p className="text-2xl font-bold">{company.size}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      {company.socialMedia && company.socialMedia.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Redes sociales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {company.socialMedia.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
