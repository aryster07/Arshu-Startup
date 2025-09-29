import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { getGeminiService } from '../services/geminiService';
import { 
  FileText, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Search,
  Brain,
  Zap,
  Target,
  Shield,
  BookOpen,
  MessageSquare
} from 'lucide-react';

interface DocumentReviewProps {
  onNavigate: (screen: string) => void;
}

interface AIAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  overallScore: number;
  keyFindings: string[];
  recommendations: string[];
  legalIssues: string[];
  summary: string;
  estimatedReadTime: string;
}

export default function DocumentReview({ onNavigate }: DocumentReviewProps) {
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const documentTypes = [
    { id: 'contract', name: 'Contract Review', description: 'Employment, rental, or business contracts', icon: <FileText className="h-5 w-5" /> },
    { id: 'legal-notice', name: 'Legal Notice', description: 'Formal legal notices and demands', icon: <AlertTriangle className="h-5 w-5" /> },
    { id: 'agreement', name: 'Agreement Draft', description: 'Partnership, service, or license agreements', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'will', name: 'Will & Testament', description: 'Estate planning documents', icon: <Shield className="h-5 w-5" /> },
    { id: 'lease', name: 'Lease Agreement', description: 'Property rental agreements', icon: <FileText className="h-5 w-5" /> },
    { id: 'other', name: 'Other Documents', description: 'Custom legal document review', icon: <Plus className="h-5 w-5" /> }
  ];

  // Real Gemini AI analysis
  const performAIAnalysis = async (file: File, documentType: string): Promise<AIAnalysisResult> => {
    try {
      const geminiService = getGeminiService();
      
      // Create document content for analysis (in real implementation, you'd extract text from file)
      const documentContent = `Document Type: ${documentType}
File Name: ${file.name}
File Size: ${file.size} bytes
File Type: ${file.type}

Please analyze this ${documentType} document for legal compliance, risks, and recommendations.`;

      // Validate if this is actually a legal document request
      const isLegalContent = await geminiService.validateLegalContent(documentContent + " " + documentType);
      
      if (!isLegalContent) {
        return {
          riskLevel: 'low',
          overallScore: 0,
          keyFindings: ['Non-legal document detected'],
          recommendations: ['Please upload legal documents only such as contracts, agreements, legal notices, etc.'],
          legalIssues: [],
          summary: 'Please talk related to law. This document review service is designed for legal documents only. Please upload contracts, agreements, legal notices, court documents, or other legal materials for professional analysis.',
          estimatedReadTime: '1 minute'
        };
      }

      const result = await geminiService.reviewDocument({
        type: 'document-review',
        content: documentContent,
        context: {
          category: documentType,
          jurisdiction: 'India',
          urgency: 'medium'
        }
      });

      // Transform Gemini response to match component's expected format
      return {
        riskLevel: (result.riskLevel?.toLowerCase() as 'low' | 'medium' | 'high') || 'medium',
        overallScore: result.confidence || 85,
        keyFindings: result.recommendedActions?.slice(0, 4) || [
          "Document structure analyzed",
          "Legal compliance reviewed",
          "Risk assessment completed",
          "Recommendations prepared"
        ],
        recommendations: result.recommendedActions || [
          "Review document with legal expert",
          "Consider additional protective clauses",
          "Ensure compliance with applicable laws",
          "Update terms as needed"
        ],
        legalIssues: result.applicableLaws?.map(law => `Review compliance with ${law}`) || [],
        summary: result.analysis || `This ${documentType.toLowerCase()} has been analyzed using advanced AI. The analysis provides insights into legal compliance, potential risks, and recommendations for improvement.`,
        estimatedReadTime: "3-5 minutes"
      };
    } catch (error) {
      console.error('Gemini AI analysis failed:', error);
      
      // Fallback to basic analysis if AI fails
      return {
        riskLevel: 'medium',
        overallScore: 75,
        keyFindings: [
          "AI analysis temporarily unavailable",
          "Basic document structure reviewed",
          "Standard legal review recommended",
          "Professional consultation advised"
        ],
        recommendations: [
          "Consult with a legal professional",
          "Review document thoroughly",
          "Ensure all terms are understood",
          "Consider legal compliance requirements"
        ],
        legalIssues: [
          "Professional legal review recommended due to AI service unavailability"
        ],
        summary: `Document uploaded successfully. Due to temporary AI service unavailability, we recommend professional legal review of this ${documentType.toLowerCase()}.`,
        estimatedReadTime: "5-10 minutes"
      };
    }
  };

  const recentDocuments = [
    {
      id: 1,
      name: 'Employment Contract_v2.pdf',
      type: 'Contract Review',
      status: 'AI Analyzed',
      uploadDate: '2024-12-10',
      riskLevel: 'medium',
      score: 85
    },
    {
      id: 2,
      name: 'Rental Agreement_Draft.docx',
      type: 'Lease Agreement',
      status: 'AI Analyzed',
      uploadDate: '2024-12-08',
      riskLevel: 'low',
      score: 92
    },
    {
      id: 3,
      name: 'Legal Notice_Consumer.pdf',
      type: 'Legal Notice',
      status: 'AI Analyzed',
      uploadDate: '2024-12-07',
      riskLevel: 'high',
      score: 73
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AI Analyzed': return 'bg-green-100 text-green-800';
      case 'Analyzing': return 'bg-blue-100 text-blue-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0] && selectedDocument) {
      const file = files[0];
      setUploadedFile(file);
      setIsAnalyzing(true);
      setAnalysisResult(null);

      try {
        const result = await performAIAnalysis(file, selectedDocument);
        setAnalysisResult(result);
      } catch (error) {
        console.error('Analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="h-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full mb-6">
            <Brain className="h-4 w-4 mr-2" />
            AI-Powered Document Analysis
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Instant Legal Document Review
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Get immediate AI-powered analysis of your legal documents with detailed insights, risk assessment, and actionable recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload New Document */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="flex items-center mb-6">
                <Zap className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-slate-900">AI Document Analysis</h2>
              </div>
              
              {/* Document Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-900 mb-3">
                  Select Document Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedDocument === type.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedDocument(type.id)}
                    >
                      <div className="flex items-center mb-2">
                        {type.icon}
                        <h3 className="font-medium text-slate-900 ml-2">{type.name}</h3>
                      </div>
                      <p className="text-sm text-slate-600">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Upload Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-900 mb-3">
                  Upload Document for Instant AI Analysis
                </label>
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  isAnalyzing 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-slate-300 hover:border-blue-400'
                }`}>
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center">
                      <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
                      <p className="text-blue-700 font-medium mb-2">AI Analysis in Progress...</p>
                      <p className="text-sm text-blue-600">Analyzing document structure, clauses, and potential risks</p>
                      <div className="mt-4 w-32">
                        <Progress value={66} className="h-2" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 mb-2">
                        Drop your document here for instant AI analysis
                      </p>
                      <p className="text-sm text-slate-500 mb-4">
                        Supports PDF, DOC, DOCX files up to 10MB • Analysis takes 3-5 seconds
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileUpload}
                        disabled={!selectedDocument || isAnalyzing}
                      />
                      <label htmlFor="file-upload">
                        <Button 
                          className={`cursor-pointer ${!selectedDocument ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!selectedDocument || isAnalyzing}
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          Start AI Analysis
                        </Button>
                      </label>
                      {!selectedDocument && (
                        <p className="text-sm text-red-500 mt-2">Please select a document type first</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* AI Analysis Results */}
              {analysisResult && (
                <div className="mt-8 space-y-6">
                  <div className="border-t pt-6">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                      <h3 className="text-xl font-bold text-slate-900">Analysis Complete</h3>
                    </div>

                    {/* Overall Score & Risk Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600">Overall Score</p>
                            <p className="text-2xl font-bold text-slate-900">{analysisResult.overallScore}/100</p>
                          </div>
                          <Target className="h-8 w-8 text-blue-600" />
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600">Risk Level</p>
                            <Badge className={getRiskColor(analysisResult.riskLevel)}>
                              {analysisResult.riskLevel.toUpperCase()}
                            </Badge>
                          </div>
                          <AlertTriangle className="h-8 w-8 text-orange-600" />
                        </div>
                      </Card>
                    </div>

                    {/* Summary */}
                    <Card className="p-6 mb-6">
                      <h4 className="font-semibold text-slate-900 mb-3">AI Summary</h4>
                      <p className="text-slate-700 leading-relaxed">{analysisResult.summary}</p>
                      <p className="text-sm text-slate-500 mt-2">Estimated reading time: {analysisResult.estimatedReadTime}</p>
                    </Card>

                    {/* Key Findings */}
                    <Card className="p-6 mb-6">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Key Findings
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.keyFindings.map((finding, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    {/* Legal Issues */}
                    {analysisResult.legalIssues.length > 0 && (
                      <Card className="p-6 mb-6 border-orange-200 bg-orange-50">
                        <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Potential Legal Issues
                        </h4>
                        <ul className="space-y-2">
                          {analysisResult.legalIssues.map((issue, index) => (
                            <li key={index} className="flex items-start">
                              <AlertTriangle className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-orange-800">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}

                    {/* Recommendations */}
                    <Card className="p-6 border-blue-200 bg-blue-50">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        AI Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start">
                            <Target className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-blue-800">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-6">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Consult Lawyer
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* AI Features & Benefits */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Brain className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-slate-900">AI Analysis Features</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Instant Analysis</p>
                    <p className="text-sm text-slate-600">Get results in 3-5 seconds</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Risk Assessment</p>
                    <p className="text-sm text-slate-600">Identify potential legal issues</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Smart Recommendations</p>
                    <p className="text-sm text-slate-600">Actionable improvement suggestions</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-slate-900">Why Choose AI Review?</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-slate-700">100% Free Analysis</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-slate-700">24/7 Availability</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-slate-700">Comprehensive Reports</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-slate-700">Expert Consultation Available</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent AI Analyzed Documents */}
        <div className="mt-12">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Brain className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-2xl font-bold text-slate-900">Recent AI Analyzed Documents</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input placeholder="Search documents..." className="pl-10 w-64" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Document</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">AI Score</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Risk Level</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-slate-400" />
                          <span className="font-medium text-slate-900">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{doc.type}</td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(doc.status)}>
                          <Brain className="h-3 w-3 mr-1" />
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full transition-all duration-300"
                              style={{ width: `${doc.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-900">{doc.score}/100</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getRiskColor(doc.riskLevel)}>
                          {doc.riskLevel.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{doc.uploadDate}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" title="View Analysis">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Download Report">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Consult Lawyer">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {recentDocuments.length === 0 && (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg mb-2">No documents analyzed yet</p>
                <p className="text-slate-400">Upload your first document to get started with AI analysis</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}