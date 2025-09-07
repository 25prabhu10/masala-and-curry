import { relations } from 'drizzle-orm'

import { category } from './category.schema'
import { menuItem } from './menu-item.schema'
import { menuOption } from './menu-option.schema'
import { menuOptionGroup } from './menu-option-group.schema'

export const categoryRelations = relations(category, ({ many }) => ({
  menuItems: many(menuItem),
}))

export const menuItemRelations = relations(menuItem, ({ one, many }) => ({
  category: one(category, {
    fields: [menuItem.categoryId],
    references: [category.id],
  }),
  optionGroups: many(menuOptionGroup),
}))

export const menuOptionGroupRelations = relations(menuOptionGroup, ({ one, many }) => ({
  menuItem: one(menuItem, {
    fields: [menuOptionGroup.menuItemId],
    references: [menuItem.id],
  }),
  options: many(menuOption),
}))

export const menuOptionRelations = relations(menuOption, ({ one }) => ({
  optionGroup: one(menuOptionGroup, {
    fields: [menuOption.groupId],
    references: [menuOptionGroup.id],
  }),
}))
