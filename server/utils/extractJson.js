const extractJson = async (text) => {
    if (!text) return null;
    
    try {
        return JSON.parse(text);
    } catch(e) {}
    
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[1]);
        } catch(e) {}
    }
    
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
            return JSON.parse(text.slice(firstBrace, lastBrace + 1));
        } catch(e) {
            console.error("Failed to parse JSON:", e.message);
        }
    }
    
    return null;
}
export default extractJson;