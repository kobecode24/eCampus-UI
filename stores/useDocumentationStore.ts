import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { documentationService } from '@/services/api'
import { DocumentationDTO, DocumentationSectionDTO } from '@/app/types/documentation'

interface DocumentationState {
  // Selected items
  selectedDocumentation: DocumentationDTO | null
  selectedSection: DocumentationSectionDTO | null
  
  // Collections
  documentations: DocumentationDTO[]
  sections: DocumentationSectionDTO[]
  
  // UI states
  loading: boolean
  error: string | null
  isEditing: boolean
  
  // Fetching functions
  fetchDocumentations: () => Promise<void>
  fetchDocumentation: (id: string) => Promise<void>
  fetchDocumentSections: (docId: string) => Promise<DocumentationSectionDTO[]>
  
  // Selection functions
  setSelectedDocumentation: (doc: DocumentationDTO | null) => void
  setSelectedSection: (section: DocumentationSectionDTO | null) => void
  
  // CRUD operations
  createDocumentation: (data: { title: string; content: string; technology: string; tags?: string[] }) => Promise<DocumentationDTO>
  createSection: (docId: string, data: { title: string; content: string; sectionId?: string; orderIndex?: number }) => Promise<DocumentationSectionDTO>
  updateSection: (sectionId: string, data: Partial<DocumentationSectionDTO>) => Promise<DocumentationSectionDTO>
  updateDocumentationStatus: (docId: string, status: string, comment?: string) => Promise<void>
}

export const useDocumentationStore = create<DocumentationState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial states
        selectedDocumentation: null,
        selectedSection: null,
        documentations: [],
        sections: [],
        loading: false,
        error: null,
        isEditing: false,
        
        // Fetch all documentations (folders)
        fetchDocumentations: async () => {
          set({ loading: true, error: null })
          try {
            const response = await documentationService.getAllDocumentation()
            if (response.data.success) {
              set({ 
                documentations: response.data.data.content,
                loading: false 
              })
            } else {
              set({ 
                error: 'Failed to fetch documentations', 
                loading: false 
              })
            }
          } catch (error) {
            console.error('Error fetching documentations:', error)
            set({ 
              error: 'Failed to fetch documentations', 
              loading: false 
            })
          }
        },
        
        // Fetch a specific documentation with its sections
        fetchDocumentation: async (id) => {
          set({ loading: true, error: null })
          try {
            const response = await documentationService.getDocumentation(id)
            if (response.data.success) {
              const documentation = response.data.data
              set({ 
                selectedDocumentation: documentation,
                sections: documentation.sections || [],
                loading: false 
              })
              return documentation
            } else {
              set({ 
                error: 'Failed to fetch documentation', 
                loading: false 
              })
              throw new Error('Failed to fetch documentation')
            }
          } catch (error) {
            console.error('Error fetching documentation:', error)
            set({ 
              error: 'Failed to fetch documentation', 
              loading: false 
            })
            throw error
          }
        },
        
        // Fetch sections for a documentation
        fetchDocumentSections: async (docId) => {
          set({ loading: true, error: null })
          try {
            const response = await documentationService.getDocumentation(docId)
            if (response.data.success) {
              const sections = response.data.data.sections || []
              set({ 
                sections: sections,
                loading: false 
              })
              return sections
            } else {
              set({ 
                error: 'Failed to fetch sections', 
                loading: false 
              })
              return []
            }
          } catch (error) {
            console.error('Error fetching sections:', error)
            set({ 
              error: 'Failed to fetch sections', 
              loading: false 
            })
            return []
          }
        },
        
        // Set selected documentation
        setSelectedDocumentation: (doc) => {
          set({ 
            selectedDocumentation: doc,
            // Clear section selection when changing documentation
            selectedSection: null
          })
        },
        
        // Set selected section
        setSelectedSection: (section) => {
          set({ selectedSection: section })
        },
        
        // Create new documentation
        createDocumentation: async (data) => {
          set({ loading: true, error: null })
          try {
            const response = await documentationService.createDocumentation(data)
            if (response.data.success) {
              // Refresh the documentations list
              get().fetchDocumentations()
              set({ loading: false })
              return response.data.data
            } else {
              set({ 
                error: 'Failed to create documentation', 
                loading: false 
              })
              throw new Error('Failed to create documentation')
            }
          } catch (error) {
            console.error('Error creating documentation:', error)
            set({ 
              error: 'Failed to create documentation', 
              loading: false 
            })
            throw error
          }
        },
        
        // Create new section
        createSection: async (docId, data) => {
          set({ loading: true, error: null })
          try {
            const response = await documentationService.createSection(docId, data)
            if (response.data.success) {
              // Refresh the sections
              const updatedSections = await get().fetchDocumentSections(docId)
              set({ loading: false })
              return response.data.data
            } else {
              set({ 
                error: 'Failed to create section', 
                loading: false 
              })
              throw new Error('Failed to create section')
            }
          } catch (error) {
            console.error('Error creating section:', error)
            set({ 
              error: 'Failed to create section', 
              loading: false 
            })
            throw error
          }
        },
        
        // Update a section
        updateSection: async (sectionId, data) => {
          set({ loading: true, error: null })
          try {
            const response = await documentationService.updateSection(sectionId, data)
            if (response.data.success) {
              // Update the section in the state
              const updatedSection = response.data.data
              set(state => {
                // Update the section in the sections array
                const updatedSections = state.sections.map(s => 
                  s.id === sectionId ? { ...s, ...updatedSection } : s
                )
                
                // Update selected section if it's the one that was updated
                const newSelectedSection = state.selectedSection?.id === sectionId 
                  ? { ...state.selectedSection, ...updatedSection }
                  : state.selectedSection
                
                return {
                  sections: updatedSections,
                  selectedSection: newSelectedSection,
                  loading: false
                }
              })
              return updatedSection
            } else {
              set({ 
                error: 'Failed to update section', 
                loading: false 
              })
              throw new Error('Failed to update section')
            }
          } catch (error) {
            console.error('Error updating section:', error)
            set({ 
              error: 'Failed to update section', 
              loading: false 
            })
            throw error
          }
        },
        
        // Update documentation status
        updateDocumentationStatus: async (docId, status, comment) => {
          set({ loading: true, error: null })
          try {
            const response = await documentationService.updateDocumentStatus(docId, status, comment)
            if (response.data.success) {
              // Refresh the documentations
              get().fetchDocumentations()
              
              // If the currently selected documentation is the one being updated, refresh it
              if (get().selectedDocumentation?.id === docId) {
                get().fetchDocumentation(docId)
              }
              
              set({ loading: false })
            } else {
              set({ 
                error: 'Failed to update documentation status', 
                loading: false 
              })
              throw new Error('Failed to update documentation status')
            }
          } catch (error) {
            console.error('Error updating documentation status:', error)
            set({ 
              error: 'Failed to update documentation status', 
              loading: false 
            })
            throw error
          }
        }
      }),
      {
        name: 'documentation-storage',
        partialize: (state) => ({ 
          selectedDocumentation: state.selectedDocumentation,
          selectedSection: state.selectedSection
        }),
      }
    )
  )
)
