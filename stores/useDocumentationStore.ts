import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import {documentationService, userService} from '@/services/api'
import { DocumentationDTO, DocumentationSectionDTO } from '@/app/types/documentation'
import { toast } from '@/components/ui/use-toast'

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
  
  // User metadata
  usernames: { [key: string]: string }
  
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
  updateDocumentation: (docId: string, data: Partial<DocumentationDTO>) => Promise<DocumentationDTO>
  updateDocumentationStatus: (docId: string, status: string, comment?: string) => Promise<void>
  
  // Metadata helpers
  getLastModifiedDate: (docId: string) => string | null
  getLastModifiedBy: (docId: string) => string | null
  getSectionLastModifiedDate: (sectionId: string) => string | null
  getSectionLastModifiedBy: (sectionId: string) => string | null
  
  // Helper functions
  getFormattedLastUpdated: (section: DocumentationSectionDTO | null) => string
  getLastModifiedByUsername: (section: DocumentationSectionDTO | null) => string
  fetchUsername: (userId: string) => Promise<string>
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
        usernames: {},
        
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
                error: response.data.message || 'Failed to fetch documentations',
                loading: false
              })
            }
          } catch (error: any) {
            console.error("Error fetching documentations:", error)
            set({ 
              error: error.message || 'Failed to fetch documentations',
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
              
              // Also update the sections array with the documentation sections
              const sections = documentation.sections || []
              
              set({ 
                selectedDocumentation: documentation,
                sections,
                loading: false
              })
              
              return documentation
            } else {
              set({ 
                error: response.data.message || 'Failed to fetch documentation',
                loading: false
              })
              throw new Error(response.data.message || 'Failed to fetch documentation')
            }
          } catch (error: any) {
            console.error("Error fetching documentation:", error)
            set({ 
              error: error.message || 'Failed to fetch documentation',
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
              const sections = response.data.data
              set({ 
                sections,
                loading: false
              })
              return sections
            } else {
              set({ 
                error: response.data.message || 'Failed to fetch sections',
                loading: false
              })
              throw new Error(response.data.message || 'Failed to fetch sections')
            }
          } catch (error: any) {
            console.error("Error fetching sections:", error)
            set({ 
              error: error.message || 'Failed to fetch sections',
              loading: false
            })
            throw error
          }
        },
        
        // Set selected documentation
        setSelectedDocumentation: (doc) => {
          set({ selectedDocumentation: doc })
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
              const newDoc = response.data.data
              set((state) => ({ 
                documentations: [...state.documentations, newDoc],
                loading: false
              }))
              
              toast({
                title: "Success",
                description: "Documentation created successfully"
              })
              
              return newDoc
            } else {
              set({ 
                error: response.data.message || 'Failed to create documentation',
                loading: false
              })
              
              toast({
                title: "Error",
                description: response.data.message || 'Failed to create documentation',
                variant: "destructive"
              })
              
              throw new Error(response.data.message || 'Failed to create documentation')
            }
          } catch (error: any) {
            console.error("Error creating documentation:", error)
            set({ 
              error: error.message || 'Failed to create documentation',
              loading: false
            })
            
            toast({
              title: "Error",
              description: error.message || 'Failed to create documentation',
              variant: "destructive"
            })
            
            throw error
          }
        },
        
        // Create new section
        createSection: async (docId, data) => {
          set({ loading: true, error: null })
          try {
            const response = await documentationService.createSection(docId, {...data})
            
            if (response.data.success) {
              const newSection = response.data.data
              
              set((state) => ({ 
                sections: [...state.sections, newSection],
                loading: false
              }))
              
              toast({
                title: "Success",
                description: "Section created successfully"
              })
              
              return newSection
            } else {
              set({ 
                error: response.data.message || 'Failed to create section',
                loading: false
              })
              
              toast({
                title: "Error",
                description: response.data.message || 'Failed to create section',
                variant: "destructive"
              })
              
              throw new Error(response.data.message || 'Failed to create section')
            }
          } catch (error: any) {
            console.error("Error creating section:", error)
            set({ 
              error: error.message || 'Failed to create section',
              loading: false
            })
            
            toast({
              title: "Error",
              description: error.message || 'Failed to create section',
              variant: "destructive"
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
              
              // Update the section in the sections array
              set((state) => ({ 
                sections: state.sections.map(section => 
                  section.id === sectionId ? { ...section, ...updatedSection } : section
                ),
                // If this is the currently selected section, update it too
                selectedSection: state.selectedSection?.id === sectionId 
                  ? { ...state.selectedSection, ...updatedSection } 
                  : state.selectedSection,
                loading: false
              }))
              
              return updatedSection
            } else {
              set({ 
                error: response.data.message || 'Failed to update section',
                loading: false
              })
              
              throw new Error(response.data.message || 'Failed to update section')
            }
          } catch (error: any) {
            console.error("Error updating section:", error)
            set({ 
              error: error.message || 'Failed to update section',
              loading: false
            })
            throw error
          }
        },
        
        // Update documentation
        updateDocumentation: async (docId, data) => {
          set({ loading: true, error: null })
          try {
            const response = await documentationService.updateDocumentation(docId, data)
            
            if (response.data.success) {
              const updatedDoc = response.data.data
              
              // Update the documentation in the documentations array and selected documentation if needed
              set((state) => ({ 
                documentations: state.documentations.map(doc => 
                  doc.id === docId ? { ...doc, ...updatedDoc } : doc
                ),
                selectedDocumentation: state.selectedDocumentation?.id === docId 
                  ? { ...state.selectedDocumentation, ...updatedDoc } 
                  : state.selectedDocumentation,
                loading: false
              }))
              
              return updatedDoc
            } else {
              set({ 
                error: response.data.message || 'Failed to update documentation',
                loading: false
              })
              
              throw new Error(response.data.message || 'Failed to update documentation')
            }
          } catch (error: any) {
            console.error("Error updating documentation:", error)
            set({ 
              error: error.message || 'Failed to update documentation',
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
                error: response.data.message || 'Failed to update documentation status',
                loading: false
              })
              
              toast({
                title: "Error",
                description: response.data.message || 'Failed to update documentation status',
                variant: "destructive"
              })
              
              throw new Error(response.data.message || 'Failed to update documentation status')
            }
          } catch (error: any) {
            console.error("Error updating documentation status:", error)
            set({ 
              error: error.message || 'Failed to update documentation status',
              loading: false
            })
            
            toast({
              title: "Error",
              description: error.message || 'Failed to update documentation status',
              variant: "destructive"
            })
            
            throw error
          }
        },
        
        // Metadata helper functions
        getLastModifiedDate: (docId: string) => {
          const { documentations } = get()
          const doc = documentations.find(doc => doc.id === docId)
          return doc?.lastUpdatedAt || null
        },
        
        getLastModifiedBy: (docId: string) => {
          const { documentations } = get()
          const doc = documentations.find(doc => doc.id === docId)
          return doc?.lastModifiedBy || null
        },
        
        getSectionLastModifiedDate: (sectionId: string) => {
          const { sections } = get()
          const section = sections.find(section => section.id === sectionId)
          return section?.lastUpdatedAt || null
        },
        
        getSectionLastModifiedBy: (sectionId: string) => {
          const { sections } = get()
          const section = sections.find(section => section.id === sectionId)
          return section?.lastModifiedBy || null
        },
        
        // Implement the missing helper functions
        getFormattedLastUpdated: (section: DocumentationSectionDTO | null) => {
          if (!section || !section.lastUpdatedAt) return 'Never updated';
          
          const lastUpdated = new Date(section.lastUpdatedAt);
          const now = new Date();
          const diffMs = now.getTime() - lastUpdated.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);
          
          if (diffMins < 1) return 'Just now';
          if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
          if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
          if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
          
          return lastUpdated.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
        },

        getLastModifiedByUsername: (section: DocumentationSectionDTO | null) => {
          if (!section || !section.lastModifiedBy) return 'Unknown';

          const userId = section.lastModifiedBy;
          const cachedUsername = get().usernames[userId];

          // First check cached names
          if (cachedUsername) return cachedUsername;

          // Check if the user is the documentation author
          const parentDoc = get().documentations.find(doc =>
            doc.id === section.documentationId &&
            doc.authorId === userId
          );

          // If found, use documentation's authorUsername
          if (parentDoc?.authorUsername) return parentDoc.authorUsername;

          // Trigger fetch and return loading state
          get().fetchUsername(userId);
          return 'Loading...';
        },

        fetchUsername: async (userId: string) => {
          try {
            // First check if we already have the username cached
            const cachedUsername = get().usernames[userId];
            if (cachedUsername) return cachedUsername;

            // Use the actual API endpoint
            const response = await userService.getUser(userId);

            if (response.data && response.data.username) {
              const username = response.data.username;

              // Update the username cache
              set((state) => ({
                usernames: { ...state.usernames, [userId]: username }
              }));

              return username;
            }

            return 'Unknown';
          } catch (error) {
            console.error(`Error fetching username for ${userId}:`, error);
            return 'Unknown';
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
