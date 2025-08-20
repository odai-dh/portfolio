"use client";

import type { Skill } from '@/lib/markdown';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SkillsChart({ skills }: { skills: Skill[] }) {
  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>Technology Proficiency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skills} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={120}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 14 }}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--secondary))' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Skill</span>
                            <span className="font-bold text-foreground">{payload[0].payload.name}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Proficiency</span>
                            <span className="font-bold text-foreground">{payload[0].value}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="proficiency" radius={[0, 4, 4, 0]} fill="hsl(var(--primary))" background={{ fill: 'hsl(var(--secondary))', radius: 4 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
