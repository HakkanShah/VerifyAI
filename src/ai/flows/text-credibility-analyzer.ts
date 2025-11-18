'use server';
/**
 * @fileOverview AI-powered text credibility analysis flow.
 *
 * - textCredibilityAnalysis - Analyzes text or a news headline for credibility.
 * - TextCredibilityAnalysisInput - The input type for the textCredibilityAnalysis function.
 * - TextCredibilityAnalysisOutput - The return type for the textCredibilityAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TextCredibilityAnalysisInputSchema = z.object({
  text: z.string().describe('The text, article, or news headline to analyze.'),
});
export type TextCredibilityAnalysisInput = z.infer<
  typeof TextCredibilityAnalysisInputSchema
>;

const TextCredibilityAnalysisOutputSchema = z.object({
  credibilityScore: z
    .number()
    .describe('A score from 0 (very low credibility) to 1 (very high credibility) based on the analysis.'),
  factCheckSummary:
    z.string().describe('A detailed summary of the fact-check analysis, including evidence and explanations for the credibility score.'),
  manipulatedPhrases:
    z.array(z.string()).describe('Specific phrases or claims identified as potentially misleading, biased, or manipulated.'),
  relatedArticles: z.array(z.object({
    title: z.string().describe('The title of the related article.'),
    url: z.string().url().describe('The URL of the related article.'),
    source: z.string().describe('The name of the news source or publication.'),
  })).describe('A list of related articles from verified news sources that provide context or evidence for the analysis.'),
});
export type TextCredibilityAnalysisOutput = z.infer<
  typeof TextCredibilityAnalysisOutputSchema
>;

export async function textCredibilityAnalysis(
  input: TextCredibilityAnalysisInput
): Promise<TextCredibilityAnalysisOutput> {
  return textCredibilityAnalysisFlow(input);
}

const textCredibilityAnalysisPrompt = ai.definePrompt({
  name: 'textCredibilityAnalysisPrompt',
  input: {schema: TextCredibilityAnalysisInputSchema},
  output: {schema: TextCredibilityAnalysisOutputSchema},
  prompt: `**Crucial Instruction: You have access to a search tool. Use it to find the most current information available to verify the claims in the text. Your analysis MUST be based on real-world events, figures, and data up to the present moment.**

You are a leading investigative journalist and fact-checker with expertise in identifying misinformation, disinformation, and propaganda. Your task is to conduct a rigorous credibility analysis of the provided text.

Analyze the following text:

Text: {{{text}}}

Your analysis must include:
1.  A credibility score from 0.0 to 1.0.
2.  A comprehensive fact-check summary. Explain your reasoning for the score. Use the search tool to corroborate or debunk claims by cross-referencing with verified, up-to-date sources. Assess the tone, sourcing, and potential for bias.
3.  A list of specific phrases or claims that appear to be manipulated, misleading, or factually incorrect.
4.  A list of up to 3 related articles from reputable, verified news portals (e.g., Reuters, Associated Press, BBC, major national newspapers) that you find using the search tool. These should provide context or a fact-check for the claims.

Return the results in JSON format.`,
});

const textCredibilityAnalysisFlow = ai.defineFlow(
  {
    name: 'textCredibilityAnalysisFlow',
    inputSchema: TextCredibilityAnalysisInputSchema,
    outputSchema: TextCredibilityAnalysisOutputSchema,
  },
  async input => {
    const {output} = await textCredibilityAnalysisPrompt(input);
    return output!;
  }
);
