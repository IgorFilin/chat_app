import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { QuestionThemeEnum } from './model/learning-center.interface';
import { CreateArticleDto } from './dto/createArticle.dto';
import { Article } from './entities/article.entity';
import { Tags } from './entities/tags.entity';
import { Views } from './entities/views-article.entity';

@Injectable()
export class LearningCenterService {
  constructor(
    @InjectRepository(User)
    private UserTable: Repository<User>,
    @InjectRepository(Question)
    private QuestionTable: Repository<Question>,
    @InjectRepository(Answer)
    private AnswerTable: Repository<Answer>,
    @InjectRepository(Article)
    private ArticleTable: Repository<Article>,
    @InjectRepository(Tags)
    private TagsTable: Repository<Tags>,
    @InjectRepository(Views)
    private ViewsTable: Repository<Views>
  ) {}

  async createQuestion(body: CreateQuestionDto, token: string) {
    try {
      const user = await this.UserTable.findOneBy({ authToken: token });
      if (!user) {
        return {
          message: 'Пользователь не найден',
        };
      }
      const question = new Question();
      question.title = body.question;
      question.theme = body.theme;
      question.description = body.description ?? '';
      question.user = user;
      const savedQuestion = await this.QuestionTable.save(question);

      for (const requestAnswer of body.answers) {
        const newAnswer = new Answer();
        newAnswer.title = requestAnswer.value;
        newAnswer.question = savedQuestion;
        newAnswer.isCorrect = requestAnswer.accept;
        await this.AnswerTable.save(newAnswer);
      }
      return {
        message: 'Вопрос успешно создан',
      };
    } catch (e) {
      return {
        error: 'Ошибка создания вопроса',
        message: e.message,
      };
    }
  }

  async getQuestions(filter: QuestionThemeEnum) {
    let responseQuestionData = [];

    try {
      let questions = await this.QuestionTable.find({
        relations: ['answer'],
      });

      if (!filter)
        ({
          message: 'Вопросы получены',
          data: questions,
        });

      if (Object.values(QuestionThemeEnum).includes(filter)) {
        questions = questions.filter((question) => question.theme.includes(filter));

        if (questions.length) {
          return {
            message: 'Отфильтрованные вопросы получены',
            data: questions,
          };
        } else {
          return {
            message: 'Отфильтрованные вопросы не найдены',
            data: [],
          };
        }
      } else {
        return {
          message: 'Неверный фильтр',
          data: [],
        };
      }
    } catch (e) {
      return {
        error: 'Ошибка получения вопросов',
        message: e.message,
      };
    }

    return responseQuestionData;
  }

  async createArticle(body: CreateArticleDto, token: string) {
    try {
      const user = await this.UserTable.findOneBy({ authToken: token });
      if (!user) {
        return {
          message: 'Пользователь не найден',
        };
      }
      const article = new Article();
      article.title = body.title;
      article.views = [];
      article.description = body.text ?? '';
      article.user = user;
      article.tags = []
  
      for (const tag of body.tags) {
        let existingTag = await this.TagsTable.findOne({ where:{ title: tag }, relations: ['article'] });

        if (!existingTag) {
          existingTag = new Tags();
          existingTag.title = tag
          existingTag.article = [];
        }
       
        if(!existingTag.article.includes(article)) {
          existingTag.article.push(article);
        }
        
        article.tags.push(existingTag);

        await this.TagsTable.save(existingTag);
      }
      await this.ArticleTable.save(article);

      return {
        message: 'Статья создана',
      };
    } catch (e) {
      return {
        error: 'Ошибка создания статьи',
        message: e.message,
      };
    }
  }

  async getArticles(filter:string) {
    try {
      let articles: Article[];

      if (filter === 'all') {
        articles = await this.ArticleTable.find({
          relations: ['tags', 'views'],
        });

      } else {
        // articles = await this.ArticleTable.find({
        //   where: { theme: filter },
        //   relations: ['tags', 'views'],
        // });
      }
      
      if (articles)  {
        return articles
      }
    } catch (e) {
      return {
        message: 'Произошла ошибка при получении статей'
      }
    }
  }

  private async setView(token: string, article: Article) {
   try {
    if (!token) return
   
    const user = await this.UserTable.findOneByOrFail({
      authToken: token,
    });
    
    if(!user) return

    const existingView = await this.ViewsTable.findOne({
        where: {
          userId: user.id,
          article: { id: article.id },
        },
    });

    if (!existingView) {
      const view = new Views();
      view.userId = user.id; 
      view.article = article; 
      await this.ViewsTable.save(view);
    }
   } catch(e) {
     console.log(e.message)
   }
  }

  async getArticle(id:string, token:string) {
    try {
      let article = await this.ArticleTable.findOne({ where:{ id }, relations: ['tags', 'views', 'user']});
      await this.setView(token, article);

      if (article)  {
        return {
          ...article,
          user: {
            id: article.user.id,
            name:  article.user.name,
          }
        }
      }
    } catch (e) {
      return {
        message: 'Произошла ошибка статья недоступна'
      }
    }
  }

  async getTags(filter?:string, isAll?:boolean) {
    try {
      let tags = await this.TagsTable.find()
      
      if(isAll) return tags

      if(filter) return tags.filter(tag => tag.title.toLowerCase().includes(filter.toLowerCase()))
      return []
    } catch (e) {
      return {
        error: 'Произошла ошибка',
        message: e.message,
      };
    }
  }
}
