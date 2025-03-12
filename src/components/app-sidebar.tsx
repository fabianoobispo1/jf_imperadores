'use client'
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Home,
  Settings,
  UserPen,
  ChevronsLeftRightEllipsisIcon,
  User,
  NotebookPenIcon,
  CircleDollarSign,
  MessageCircleMore,
  ClipboardCheck,
  /*  CircleDollarSign, */
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
/* import type { Id } from '../../convex/_generated/dataModel' */
import { Skeleton } from './ui/skeleton'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Lista de tarefas',
    url: '/dashboard/lista',
    icon: NotebookPenIcon,
  },
  {
    title: 'Finanças',
    url: '/dashboard/financeiro',
    icon: CircleDollarSign,
  },
  {
    title: 'Perfil',
    url: '/dashboard/perfil',
    icon: UserPen,
  },
]
const itemsAdm = [
  {
    title: 'Seletiva',
    url: '/dashboard/seletiva',
    icon: Calendar,
  },
  {
    title: 'Administração',
    url: '/dashboard/admin',
    icon: Settings,
  },
  {
    title: 'Configurar WhatsApp',
    url: '/dashboard/configwhatsapp',
    icon: ChevronsLeftRightEllipsisIcon,
  },
  {
    title: 'Mensagens',
    url: '/dashboard/mensagens',
    icon: MessageCircleMore,
  },
  {
    title: 'Mensalidades',
    url: '/dashboard/mensalidades',
    icon: User,
  },
  {
    title: 'Controle de Presença',
    url: '/dashboard/presenca',
    icon: ClipboardCheck,
  },
  {
    title: 'Atletas',
    url: '/dashboard/atletas',
    icon: User,
  },
]

/* interface Usuario {
  _id: Id<'user'>
  _creationTime: number
  image?: string | undefined
  data_nascimento?: number | undefined
  role: 'user' | 'admin'
  nome: string
  email: string
  provider: string
  password: string
} */

export function AppSidebar() {
  const { data: session } = useSession()
  const { open } = useSidebar()
  const [isAdmin, setIsAdmin] = useState(false)
  const [carregou, setiscarregou] = useState(false)
  if (session) {
    /*     console.log(session) */

    if (!carregou) {
      if (session.user.role === 'admin') {
        setIsAdmin(true)
      }
      setiscarregou(true)
    }
  }

  /*   const [loadingData, setLoadingData] = useState(true)
  const [usuario, setUsuario] = useState<Usuario>() */
  /* 
  const loadUser = useCallback(async () => {
    setLoadingData(true)

    if (session) {
      try {
        const response = await fetchQuery(api.user.getById, {
          userId: session?.user.id as Id<'user'>,
        })

        if (!response) {
          console.error('Erro ao buscar os dados do usuário:')
          return
        }

        setUsuario(response)
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error)
      } finally {
        setLoadingData(false) // Define o carregamento como concluído
      }
    }
  }, [session])

  useEffect(() => {
    if (session) {
      loadUser()
    }
  }, [loadUser, session]) */

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Jf Imperadores</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Collapsible className="group/collapsible">
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger disabled={!isAdmin}>
                      Administração
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {itemsAdm.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <a href={item.url}>
                                <item.icon />
                                <span>{item.title}</span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {!session ? (
                    <>
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-[100px]" />
                    </>
                  ) : (
                    <>
                      <Avatar className={cn(open ? ' h-8 w-8 ' : ' h-6 w-6 ')}>
                        <AvatarImage src={session.user.image} alt={session.user.nome} />
                        <AvatarFallback>{session.user.nome[0]}</AvatarFallback>
                      </Avatar>
                      {session.user.nome}
                    </>
                  )}

                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <a href={'/dashboard/perfil'}>
                  <DropdownMenuItem>
                    <span>Perfil</span>
                  </DropdownMenuItem>
                </a>
                {/* <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => signOut()}>
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
