import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LiteracyModule, QuizQuestion } from '@/types';
import { mockLiteracyModules } from '@/lib/mock-data';
import { 
  GraduationCap, 
  Clock, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  BookOpen,
  TrendingUp,
  Shield,
  PiggyBank
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categoryIcons = {
  budgeting: PiggyBank,
  investing: TrendingUp,
  savings: Award,
  'fraud-prevention': Shield,
};

const Learn = () => {
  const { toast } = useToast();
  const [modules, setModules] = useState<LiteracyModule[]>(mockLiteracyModules);
  const [selectedModule, setSelectedModule] = useState<LiteracyModule | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const completedCount = modules.filter((m) => m.completed).length;
  const totalProgress = Math.round(
    modules.reduce((sum, m) => sum + (m.progress || 0), 0) / modules.length
  );

  const getDifficultyColor = (difficulty: LiteracyModule['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-chart-1/10 text-chart-1';
      case 'intermediate':
        return 'bg-warning/10 text-warning';
      case 'advanced':
        return 'bg-destructive/10 text-destructive';
    }
  };

  const startQuiz = (module: LiteracyModule) => {
    setSelectedModule(module);
    setIsQuizOpen(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !selectedModule) return;

    const isCorrect =
      selectedModule.quiz.questions[currentQuestion].correctAnswer === selectedAnswer;
    if (isCorrect) {
      setQuizScore(quizScore + 1);
    }

    if (currentQuestion < selectedModule.quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
      // Update module completion
      const passed = (quizScore + (isCorrect ? 1 : 0)) / selectedModule.quiz.questions.length >= 0.7;
      if (passed) {
        setModules(
          modules.map((m) =>
            m.id === selectedModule.id ? { ...m, completed: true, progress: 100 } : m
          )
        );
        toast({
          title: 'Congratulations! 🎉',
          description: 'You have completed this module and earned a certificate!',
        });
      }
    }
  };

  const closeQuiz = () => {
    setIsQuizOpen(false);
    setSelectedModule(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Financial Literacy</h1>
            <p className="text-muted-foreground">
              Learn essential financial skills with interactive modules
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modules Completed</p>
                  <p className="text-2xl font-bold text-foreground">
                    {completedCount}/{modules.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-chart-1/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-chart-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Certificates Earned</p>
                  <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <span className="text-sm font-medium text-foreground">{totalProgress}%</span>
                </div>
                <Progress value={totalProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((module) => {
            const CategoryIcon = categoryIcons[module.category] || GraduationCap;

            return (
              <Card key={module.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                        <CategoryIcon className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={`text-xs ${getDifficultyColor(module.difficulty)}`}
                          >
                            {module.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {module.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                    {module.completed && (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>

                  <Button
                    className="w-full mt-4"
                    variant={module.completed ? 'outline' : 'default'}
                    onClick={() => startQuiz(module)}
                  >
                    {module.completed ? (
                      <>
                        Review Module
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Start Learning
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quiz Dialog */}
        <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {quizCompleted ? 'Quiz Complete!' : selectedModule?.title}
              </DialogTitle>
            </DialogHeader>

            {selectedModule && !quizCompleted && (
              <div className="space-y-6 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Question {currentQuestion + 1} of{' '}
                    {selectedModule.quiz.questions.length}
                  </span>
                  <Badge variant="secondary">{selectedModule.category}</Badge>
                </div>

                <Progress
                  value={
                    ((currentQuestion + 1) / selectedModule.quiz.questions.length) * 100
                  }
                  className="h-2"
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">
                    {selectedModule.quiz.questions[currentQuestion].question}
                  </h3>

                  <RadioGroup
                    value={selectedAnswer?.toString()}
                    onValueChange={(v) => setSelectedAnswer(parseInt(v))}
                  >
                    {selectedModule.quiz.questions[currentQuestion].options.map(
                      (option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`option-${index}`}
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className="flex-1 cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      )
                    )}
                  </RadioGroup>
                </div>

                <Button
                  className="w-full"
                  onClick={handleAnswerSubmit}
                  disabled={selectedAnswer === null}
                >
                  {currentQuestion < selectedModule.quiz.questions.length - 1
                    ? 'Next Question'
                    : 'Finish Quiz'}
                </Button>
              </div>
            )}

            {quizCompleted && selectedModule && (
              <div className="space-y-6 text-center py-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {quizScore}/{selectedModule.quiz.questions.length} Correct!
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {quizScore / selectedModule.quiz.questions.length >= 0.7
                      ? "Great job! You've earned a certificate!"
                      : 'Keep learning and try again!'}
                  </p>
                </div>
                <Button className="w-full" onClick={closeQuiz}>
                  {quizScore / selectedModule.quiz.questions.length >= 0.7
                    ? 'View Certificate'
                    : 'Back to Modules'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Learn;
