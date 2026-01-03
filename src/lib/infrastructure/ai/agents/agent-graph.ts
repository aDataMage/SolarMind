import { StateGraph, END, START } from '@langchain/langgraph';
import { classifyIntent } from './intent-classifier';

// Define the State Interface
interface AgentState {
    messages: string[];
    intent?: string;
}

// Mock agent functions for the graph
const bookingAgent = async (state: AgentState) => ({ ...state, messages: [...state.messages, "Booking Agent"] });
const faqAgent = async (state: AgentState) => ({ ...state, messages: [...state.messages, "FAQ Agent"] });

// Wrapper to adapt classifyIntent to graph node
const classifierNode = async (state: AgentState) => {
    const lastMessage = state.messages[state.messages.length - 1];
    const result = await classifyIntent(lastMessage);
    return { ...state, intent: result.object.intent };
};

// Define the State Machine
const workflow = new StateGraph<AgentState>({ channels: { messages: { reducer: (a: string[], b: string[]) => [...a, ...b] }, intent: null } })
    .addNode('classifier', classifierNode)
    .addNode('booking_agent', bookingAgent)
    .addNode('faq_agent', faqAgent);

// Define Routing Logic
workflow.addEdge(START, 'classifier');
workflow.addConditionalEdges('classifier', (state) => state.intent === 'booking' ? 'booking_agent' : 'faq_agent', {
    booking_agent: 'booking_agent',
    faq_agent: 'faq_agent',
});
workflow.addEdge('booking_agent', END);
workflow.addEdge('faq_agent', END);

export const graph = workflow.compile();
