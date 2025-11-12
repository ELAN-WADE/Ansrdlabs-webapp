"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Circle, Headphones } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface LearningModule {
  id: string
  title: string
  completed: boolean
  progress: number
}

export function LearningProgressTracker() {
  const [modules, setModules] = useState<LearningModule[]>([
    { id: "1", title: "Introduction to Urban Research", completed: true, progress: 100 },
    { id: "2", title: "Transport Systems in African Cities", completed: true, progress: 100 },
    { id: "3", title: "Building Trust in Communities", completed: false, progress: 65 },
    { id: "4", title: "Food Security & Urban Planning", completed: false, progress: 0 },
  ])

  const totalProgress = modules.reduce((acc, mod) => acc + mod.progress, 0) / modules.length

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="p-8 bg-card/60 backdrop-blur-sm rounded-2xl border border-border shadow-xl">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-2 font-serif">Your Learning Journey</h3>
            <p className="text-muted-foreground">Progress through our research modules</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Overall Progress</span>
              <span className="text-sm font-bold text-accent">{Math.round(totalProgress)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${totalProgress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-accent via-primary to-accent rounded-full shadow-lg shadow-accent/30"
              />
            </div>
          </div>

          <div className="space-y-4">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-xl border bg-card/80 border-border hover:border-accent/50 hover:shadow-lg cursor-pointer hover:bg-card transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {module.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{module.title}</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${module.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                          className="h-full bg-accent rounded-full"
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                        {module.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl shadow-accent/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent via-primary to-accent/80" />

          <div className="absolute inset-0">
            <Image
              src="/african-person-listening-to-podcast-with-headphone.jpg"
              alt="Learning through listening - African researcher with headphones"
              fill
              className="object-cover mix-blend-overlay opacity-60 card-image-enhanced"
            />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6 rounded-full bg-white/20 backdrop-blur-sm p-8 border-4 border-white/30"
            >
              <Headphones className="h-20 w-20 text-white" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="font-serif text-4xl font-bold text-white mb-4"
            >
              Learn by Listening
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg text-white/90 max-w-md"
            >
              Immerse yourself in urban research through our podcast series and audio content. Learn on the go, at your
              own pace.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
