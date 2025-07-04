"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IndianRupee, Code, AlertTriangle } from "lucide-react"
import { submissionSchema } from "@/lib/validations"
import { BugDetailsPaymentButton } from "@/components/bug-details-client"

// Define proper interfaces
interface BugAuthor {
  id: string
  name: string
  image?: string
  reputation: number
}

interface BugSubmitter {
  id: string
  name: string
  image?: string
  reputation: number
}

interface BugSubmission {
  id: string
  description: string
  solution: string
  status: string
  createdAt: string
  submitter: BugSubmitter
}

interface Bug {
  id: string
  title: string
  description: string
  stackTrace?: string
  repoSnippet?: string
  bountyAmount: number
  tags: string[]
  status: string
  createdAt: string
  author: BugAuthor
  submissions: BugSubmission[]
}

interface BugDetailsProps {
  bug: Bug
}

export function BugDetails({ bug }: BugDetailsProps) {
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [submissionData, setSubmissionData] = useState({
    description: "",
    solution: "",
  })

  const canSubmit = session?.user?.id && session.user.id !== bug.author.id && bug.status === "OPEN"
  const isAuthor = session?.user?.id === bug.author.id

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return

    setIsSubmitting(true)
    try {
      const validatedData = submissionSchema.parse(submissionData)

      const response = await fetch(`/api/bugs/${bug.id}/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      })

      if (response.ok) {
        alert("Success: Submission posted successfully")
        setShowSubmissionForm(false)
        setSubmissionData({ description: "", solution: "" })
        // Refresh the page to show the new submission
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || "Something went wrong"}`)
      }
    } catch (error) {
      alert("Error: Please check your input")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApproveSubmission = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/bugs/${bug.id}/submissions/${submissionId}/approve`, {
        method: "POST",
      })

      if (response.ok) {
        alert("Success: Submission approved successfully")
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || "Something went wrong"}`)
      }
    } catch (error) {
      alert("Error: Something went wrong")
    }
  }

  const handleRejectSubmission = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/bugs/${bug.id}/submissions/${submissionId}/reject`, {
        method: "POST",
      })

      if (response.ok) {
        alert("Success: Submission rejected")
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || "Something went wrong"}`)
      }
    } catch (error) {
      alert("Error: Something went wrong")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{bug.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bug.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 font-bold text-2xl mb-2">
                    <IndianRupee className="w-6 h-6" />
                    {bug.bountyAmount.toLocaleString()}
                  </div>
                  <Badge variant={bug.status === "OPEN" ? "default" : "secondary"}>{bug.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{bug.description}</p>
              </div>

              {bug.stackTrace && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Stack Trace
                  </h3>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">{bug.stackTrace}</pre>
                </div>
              )}

              {bug.repoSnippet && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Code Snippet
                  </h3>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">{bug.repoSnippet}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Section - Only show to bug author */}
          {isAuthor && bug.status === "OPEN" && (
            <Card>
              <CardHeader>
                <CardTitle>Bounty Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Fund your bug bounty to make it active. Developers will be able to claim and fix your bug once payment
                  is confirmed.
                </p>
                <BugDetailsPaymentButton bugId={bug.id} amount={bug.bountyAmount} />
              </CardContent>
            </Card>
          )}

          {/* Submission Form */}
          {canSubmit && (
            <Card>
              <CardHeader>
                <CardTitle>Submit a Fix</CardTitle>
              </CardHeader>
              <CardContent>
                {!showSubmissionForm ? (
                  <Button onClick={() => setShowSubmissionForm(true)}>Submit Solution</Button>
                ) : (
                  <form onSubmit={handleSubmission} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        placeholder="Describe your approach to fixing this bug"
                        value={submissionData.description}
                        onChange={(e) => setSubmissionData((prev) => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Solution</label>
                      <Textarea
                        placeholder="Provide your code solution or detailed fix"
                        rows={6}
                        value={submissionData.solution}
                        onChange={(e) => setSubmissionData((prev) => ({ ...prev, solution: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Solution"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowSubmissionForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          {/* Submissions */}
          <Card>
            <CardHeader>
              <CardTitle>Submissions ({bug.submissions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {bug.submissions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No submissions yet</p>
              ) : (
                <div className="space-y-4">
                  {bug.submissions.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={submission.submitter.image || "/placeholder.svg"} />
                            <AvatarFallback>{submission.submitter.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{submission.submitter.name}</p>
                            <p className="text-sm text-gray-500">{submission.submitter.reputation} reputation</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              submission.status === "APPROVED"
                                ? "default"
                                : submission.status === "REJECTED"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {submission.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Description</h4>
                          <p className="text-gray-700 text-sm">{submission.description}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Solution</h4>
                          <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">{submission.solution}</pre>
                        </div>
                      </div>

                      {isAuthor && submission.status === "PENDING" && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={() => handleApproveSubmission(submission.id)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRejectSubmission(submission.id)}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bug Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={bug.author.image || "/placeholder.svg"} />
                  <AvatarFallback>{bug.author.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{bug.author.name}</p>
                  <p className="text-sm text-gray-500">{bug.author.reputation} reputation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bug Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Posted</span>
                <span className="text-sm">{new Date(bug.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <Badge variant={bug.status === "OPEN" ? "default" : "secondary"}>{bug.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Bounty</span>
                <span className="text-sm font-medium flex items-center">
                  <IndianRupee className="w-3 h-3" />
                  {bug.bountyAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Submissions</span>
                <span className="text-sm">{bug.submissions.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
