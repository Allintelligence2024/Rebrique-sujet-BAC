export const PIPELINE_FIELDS = Object.freeze({
  N: ["pipeline-var-indep", "pipeline-var-dep"],
  S: ["pipeline-doc1a", "pipeline-doc1a-ded", "pipeline-doc1b", "pipeline-doc1b-ded"],
  E: ["pipeline-hyp1", "pipeline-hyp2", "pipeline-doc2"]
});

export function firstEmptyPipelineSlot(pipeline) {
  for (const key of ["stream1", "stream2"]) {
    const index = pipeline[key].findIndex((value) => !value);
    if (index >= 0) return { key, index };
  }
  return null;
}
