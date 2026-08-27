import { supabase } from '@/config/supabase'

// Jobs/Projects
export async function fetchProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching projects:', error.message)
    return { data: null, error }
  }
}

export async function fetchProjectById(id) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching project:', error.message)
    return { data: null, error }
  }
}

export async function createProject(projectData) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()

    if (error) throw error
    return { data: data?.[0], error: null }
  } catch (error) {
    console.error('Error creating project:', error.message)
    return { data: null, error }
  }
}

export async function updateProject(id, updates) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return { data: data?.[0], error: null }
  } catch (error) {
    console.error('Error updating project:', error.message)
    return { data: null, error }
  }
}

// Punch Items
export async function fetchPunchItems(projectId = null) {
  try {
    let query = supabase
      .from('punch_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching punch items:', error.message)
    return { data: null, error }
  }
}

export async function createPunchItem(punchData) {
  try {
    const { data, error } = await supabase
      .from('punch_items')
      .insert([punchData])
      .select()

    if (error) throw error
    return { data: data?.[0], error: null }
  } catch (error) {
    console.error('Error creating punch item:', error.message)
    return { data: null, error }
  }
}

export async function updatePunchItem(id, updates) {
  try {
    const { data, error } = await supabase
      .from('punch_items')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return { data: data?.[0], error: null }
  } catch (error) {
    console.error('Error updating punch item:', error.message)
    return { data: null, error }
  }
}

// Messages
export async function fetchMessages(projectId = null) {
  try {
    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching messages:', error.message)
    return { data: null, error }
  }
}

export async function createMessage(messageData) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()

    if (error) throw error
    return { data: data?.[0], error: null }
  } catch (error) {
    console.error('Error creating message:', error.message)
    return { data: null, error }
  }
}

// Trades
export async function fetchTrades() {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching trades:', error.message)
    return { data: null, error }
  }
}

export async function fetchTradeById(id) {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching trade:', error.message)
    return { data: null, error }
  }
}

// Generic query function for custom queries
export async function query(table, options = {}) {
  try {
    let queryBuilder = supabase.from(table).select('*')

    if (options.select) {
      queryBuilder = supabase.from(table).select(options.select)
    }

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value)
      })
    }

    if (options.order) {
      queryBuilder = queryBuilder.order(options.order.column, {
        ascending: options.order.ascending !== false,
      })
    }

    if (options.limit) {
      queryBuilder = queryBuilder.limit(options.limit)
    }

    const { data, error } = await queryBuilder

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error(`Error querying ${table}:`, error.message)
    return { data: null, error }
  }
}

// Test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('count')
      .limit(1)

    if (error) throw error
    return { connected: true, error: null }
  } catch (error) {
    console.error('Connection test failed:', error.message)
    return { connected: false, error }
  }
}
