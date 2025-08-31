import * as React from "react"

interface TabsContextValue {
  value?: string
  onValueChange?: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue>({})

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

const Tabs = ({ defaultValue, value, onValueChange, children, className }: TabsProps) => {
  const [internalValue, setInternalValue] = React.useState(value || defaultValue || "")

  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = onValueChange || setInternalValue

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={`tabs ${className || ""}`}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

const TabsList = ({ children, className }: TabsListProps) => {
  return (
    <div className={`tabs-list ${className || ""}`}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

const TabsTrigger = ({ value, children, className }: TabsTriggerProps) => {
  const context = React.useContext(TabsContext)

  return (
    <button
      className={`tabs-trigger ${className || ""}`}
      data-state={context.value === value ? "active" : "inactive"}
      onClick={() => context.onValueChange?.(value)}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const TabsContent = ({ value, children, className }: TabsContentProps) => {
  const context = React.useContext(TabsContext)

  if (context.value !== value) {
    return null
  }

  return (
    <div className={`tabs-content ${className || ""}`}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
