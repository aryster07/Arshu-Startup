import React from 'react';
import { Card } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import { Progress } from '../../../shared/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs';
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Scale, 
  Clock, 
  Download, 
  Share, 
  BookOpen, 
  Lightbulb, 
  Phone 
} from 'lucide-react';

interface LegalAnalysisResult {
  summary: string;
  rights: Array<{
    title: string;
    description: string;
    importance: 'high' | 'medium' | 'low';
  }>;
  violations: Array<{
    type: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  recommendations: Array<{
    action: string;
    timeline: string;
    priority: 'urgent' | 'important' | 'normal';
  }>;
  legalReferences: Array<{
    act: string;
    section: string;
    description: string;
  }>;
  nextSteps: Array<{
    step: string;
    description: string;
    timeframe: string;
  }>;
  riskAssessment?: {
    overall: 'high' | 'medium' | 'low';
    factors: string[];
  };
  consultation?: {
    recommended: boolean;
    urgency: 'immediate' | 'within_week' | 'within_month';
    specialization: string;
  };
}

interface LegalAnalysisDisplayProps {
  result: LegalAnalysisResult;
  loadingMessage: string;
  isAnalyzing: boolean;
}

export default function LegalAnalysisDisplay({ 
  result, 
  loadingMessage, 
  isAnalyzing 
}: LegalAnalysisDisplayProps) {
  if (isAnalyzing) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-lg font-medium text-slate-700">{loadingMessage}</p>
          <Progress value={33} className="w-full" />
        </div>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'important': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Summary */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
            <Scale className="h-6 w-6 mr-2 text-blue-600" />
            Legal Analysis Summary
          </h3>
          <p className="text-slate-700 leading-relaxed">{result.summary}</p>
        </div>

        {/* Risk Assessment */}
        {result.riskAssessment && (
          <div className={`p-4 rounded-lg border ${getRiskColor(result.riskAssessment.overall)}`}>
            <h4 className="font-semibold mb-2">Risk Assessment: {result.riskAssessment.overall.toUpperCase()}</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {result.riskAssessment.factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tabbed Content */}
        <Tabs defaultValue="rights" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rights">Your Rights</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="recommendations">Actions</TabsTrigger>
            <TabsTrigger value="legal">Legal Refs</TabsTrigger>
          </TabsList>

          {/* Rights Tab */}
          <TabsContent value="rights" className="space-y-4">
            <h4 className="font-semibold text-slate-900">Your Legal Rights</h4>
            {result.rights.map((right, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-slate-900 flex items-center">
                    {getImportanceIcon(right.importance)}
                    <span className="ml-2">{right.title}</span>
                  </h5>
                  <Badge variant="outline" className={getRiskColor(right.importance)}>
                    {right.importance}
                  </Badge>
                </div>
                <p className="text-slate-700 text-sm">{right.description}</p>
              </div>
            ))}
          </TabsContent>

          {/* Violations Tab */}
          <TabsContent value="violations" className="space-y-4">
            <h4 className="font-semibold text-slate-900">Potential Violations</h4>
            {result.violations.map((violation, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-slate-900">{violation.type}</h5>
                  <Badge variant="outline" className={getRiskColor(violation.severity)}>
                    {violation.severity} severity
                  </Badge>
                </div>
                <p className="text-slate-700 text-sm">{violation.description}</p>
              </div>
            ))}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <h4 className="font-semibold text-slate-900">Recommended Actions</h4>
            {result.recommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-slate-900">{rec.action}</h5>
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-slate-700 text-sm mb-1">{rec.timeline}</p>
              </div>
            ))}
          </TabsContent>

          {/* Legal References Tab */}
          <TabsContent value="legal" className="space-y-4">
            <h4 className="font-semibold text-slate-900">Legal References</h4>
            {result.legalReferences.map((ref, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h5 className="font-medium text-slate-900 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                  {ref.act} - Section {ref.section}
                </h5>
                <p className="text-slate-700 text-sm mt-1">{ref.description}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Next Steps */}
        {result.nextSteps && result.nextSteps.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Next Steps
            </h4>
            <div className="space-y-3">
              {result.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-slate-900">{step.step}</h5>
                    <p className="text-sm text-slate-600">{step.description}</p>
                    <p className="text-xs text-slate-500 mt-1">Timeframe: {step.timeframe}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consultation Recommendation */}
        {result.consultation?.recommended && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Legal Consultation Recommended
            </h4>
            <p className="text-blue-800 text-sm mb-2">
              Based on your case, we recommend consulting with a {result.consultation.specialization} specialist.
            </p>
            <Badge className="bg-blue-100 text-blue-800">
              Urgency: {result.consultation.urgency.replace('_', ' ')}
            </Badge>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4 border-t">
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" className="flex items-center">
            <Share className="h-4 w-4 mr-2" />
            Share Analysis
          </Button>
        </div>
      </div>
    </Card>
  );
}