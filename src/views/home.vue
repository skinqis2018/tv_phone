<template>
  <div class="wrap">
    <div class="keycode">{{keycode}}</div>
    <!-- <div class="bg" v-if="loading || start_show"></div> -->
    <div class="loading" v-if="loading">
      <div class="loading_main">
        <img src="@/assets/img/loading.png" alt="" class="loading_img"/>
        <span>{{loading_num}}%</span>
      </div>
    </div>
    <div @click="start" class="start_wrap" v-if="start_show"></div>
    <div class="process_wrap" v-show="process_show">
      <div class="hand" @click="backHome">
        <img src="@/assets/img/hand.png" />
        <span>按“向上”键返回</span>
      </div>
      <swiper class="swiper" :options="swiperOption" ref="swiper">
         <swiper-slide v-for="(item,index) in list_all" :key="index" @click="portal">
           <div class="swiper_item">
             <img :src="item.process_img" alt="" class="swiper_img"/>
           </div>
           <p class="text">{{item.process_text}}
             <img src="@/assets/img/star.png" v-if="item.interview && result_list[item.interview-1]==1"/> 
             <img src="@/assets/img/star_grey.png" v-if="item.interview && result_list[item.interview-1]==0"/> 
           </p>
         </swiper-slide>
      </swiper>
    </div>
    <transition name="fade">
    <div class="keyword_wrap" v-if="keyword_show">
      <img src="@/assets/img/keyword_title.png" class="title"/>
      <div class="keywords">
        <div class="keyword_main" v-for="(item,index) in keywords_now" :key="index">
          <div class="keyword" :class="keyword_index==index ? 'active' : ''">
            <p>{{item.title}}</p>
          </div>
        </div>
      </div>
      <img src="@/assets/img/back_active.png" alt="" class="back" v-if="back_show">
      <img @click="clearKeyword" src="@/assets/img/back.png" alt="" class="back" v-if="!back_show">

    </div>
    </transition>
    <transition name="fade">
    <div class="voice_wrap"  v-show="voice_show">
      <div class="title">{{keyword_detail.title}}</div>
      <div class="voice_main">
        <div class="img_wrap">
          <img :src="keyword_detail.pic" alt="" class="voice_img"/>
          <img src="@/assets/img/voice.gif" alt="" class="voice_icon">
        </div>
        <div class="text" ref="voice_text">
          <div class="tit">{{keyword_detail.question}}</div>
          <p class="detail">{{keyword_detail.text}}</p>
        </div>
      </div>
      <img src="@/assets/img/back_active.png" alt="" class="back">
    </div>
    </transition>
    <transition name="fade">
    <div class="star_wrap" v-if="star_show">
      <img src="@/assets/img/get_star.png" alt="" class="star_icon"/>
    </div>
    </transition>
    <transition name="fade">
    <div class="end_wrap" v-show="end_show">
      <div class="title">恭喜成为百年历史见证者，扫码可分享</div>
      <div class="img_wrap">
        <swiper class="swiper" :options="swiperOption1" ref="swiperEnd">
          <swiper-slide v-for="(item,index) in end_list" :key="index">
            <div class="swiper_item" :class="index==endActiveIndex ? 'active' : ''">
              <img :src="item" alt=""/>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="star">
        <div class="erweima" ref="qrCodeUrl"></div>
        <div class="text_wrap">
          <p class="text">你本次获得<span>{{result}}</span>颗星星，扫描左方二维码参与抽奖。</p>
          <div class="star_item" v-for="(item,index) in  result_list" :key="index">
            <img src="@/assets/img/star_result.png" v-if="item==1"/> 
            <img src="@/assets/img/star_result_no.png" v-if="item==0"/> 
          </div>
        </div>
        <img src="@/assets/img/retry.png" alt="" class="retry" v-if="!retry_show"/>
        <img src="@/assets/img/retry_active.png" alt="" class="retry" v-if="retry_show"/>
      </div>
    </div>
    </transition>
    <div class="interview_wrap" v-if="interview_show && default_show"></div>
    <div class="video_wrap">
      <video src="https://ziyakeji.oss-cn-beijing.aliyuncs.com/100/video.mp4" 
        width="100%" 
        height="100%"
        x5-playsinline="true" 
        playsinline="true" 
        webkit-playsinline="true" 
        x-webkit-airplay="true" 
        x5-video-player-type="h5" 
        x5-video-player-fullscreen="true" 
        x5-video-orientation="portraint"
        preload="preload"
        ref="video"
        poster="../assets/img/bg_loading.jpg"
      ></video>
      <div class="star_result" v-if="star_top_show">
        已打卡: 
        <div class="star_item" v-for="(item,index) in result_list" :key="index">
          <img src="@/assets/img/star.png" v-if="item==1"/> 
          <img src="@/assets/img/star_no.png" v-if="item==0"/> 
        </div>
      </div>
      <img src="@/assets/img/review_active.png" alt="" class="review" v-if="!loading && !start_show"/>
      <transition name="fade">
        <div class="interview_bg" v-show="interview_show">
          <img src="@/assets/img/interview.gif" alt="" class="interview">
        </div>
      </transition>
    </div>
    <audio ref="audio" class="audio" id="audio"></audio>
    <audio src="@/assets/media/bg.mp3" ref="audio_bg" class="audio_bg" id="audio_bg"  loop="loop"></audio>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import QRCode from 'qrcodejs2'
  export default {
    name:'home',
    data() {
      return {
        audio:null,
        audio_bg:null,
        keycode:'charset&lang',
        loading:true,
        loading_num:0,
        retry_show:false,
        show:false,
        start_show:false,
        keyword_show: false,
        voice_show:false,
        star_show:false,
        end_show:false,
        process_show:false,
        interview_show:false,
        default_show:false,
        star_top_show:false,
        back_show:false,
        swiperItem:{},
        swiperEndItem:{},
        activeIndex:0,
        endActiveIndex:0,
        interviewIndex:undefined,
        interviewTimer:null,
        keywords_now:[],
        keyword_detail:{},
        result:0,
        swiperOption: {
          slidesOffsetBefore:140,
          spaceBetween:20,
          slidesPerView: 4.4,
          normalizeSlideIndex:false,
          slidesPerGroup:1,
        },
        swiperOption1: {
          slidesOffsetBefore:10,
          spaceBetween:20,
          slidesPerView: 4.6,
          normalizeSlideIndex:false,
          initialSlide:0,
          slidesPerGroup:1,
          observer:true,
          observeParents:true,
        },
        keyword_index:0,
        preload:[
          require('@/assets/img/start.png'),
          require('@/assets/img/back.png'),
          require('@/assets/img/back_active.png'),
          require('@/assets/img/interview.gif'),
          require('@/assets/img/keyword_title.png'),
          require('@/assets/img/keyword.jpg'),
          require('@/assets/img/keyword0_0.jpg'),
          require('@/assets/img/keyword0_1.jpg'),
          require('@/assets/img/keyword0_2.jpg'),
          require('@/assets/img/keyword1_0.jpg'),
          require('@/assets/img/keyword2_1.jpg'),
          require('@/assets/img/keyword3_2.jpg'),
          require('@/assets/img/keyword2_0.jpg'),
          require('@/assets/img/keyword2_1.jpg'),
          require('@/assets/img/keyword2_2.jpg'),
          require('@/assets/img/keyword3_0.jpg'),
          require('@/assets/img/keyword3_1.jpg'),
          require('@/assets/img/keyword3_2.jpg'),
          require('@/assets/img/keyword4_0.jpg'),
          require('@/assets/img/keyword4_1.jpg'),
          require('@/assets/img/keyword4_2.jpg'),
          require('@/assets/img/keyword5_0.jpg'),
          require('@/assets/img/keyword5_1.jpg'),
          require('@/assets/img/keyword5_2.jpg'),
          require('@/assets/img/keyword6_0.jpg'),
          require('@/assets/img/keyword6_1.jpg'),
          require('@/assets/img/keyword6_2.jpg'),
          require('@/assets/img/get_star.png'),
          require('@/assets/img/result.jpg'),
          require('@/assets/img/voice.gif'),
          require('@/assets/img/end1.png'),
          require('@/assets/img/end2.png'),
          require('@/assets/img/end3.png'),
          require('@/assets/img/end4.png'),
          require('@/assets/img/end5.png'),
          require('@/assets/img/retry.png'),
          require('@/assets/img/retry_active.png'),
          require('@/assets/img/review.png'),
          require('@/assets/img/star_grey.png'),
          require('@/assets/img/star_no.png'),
          require('@/assets/img/star_result.png'),
          require('@/assets/img/star_result_no.png'),
          require('@/assets/img/star.png'),
          require('@/assets/img/swiper_bg.png'),
          require('@/assets/img/swiper0.jpg'),
          require('@/assets/img/swiper1.jpg'),
          require('@/assets/img/swiper2.jpg'),
          require('@/assets/img/swiper3.jpg'),
          require('@/assets/img/swiper4.jpg'),
          require('@/assets/img/swiper5.jpg'),
          require('@/assets/img/swiper6.jpg'),
          require('@/assets/img/swiper7.jpg'),
          require('@/assets/img/swiper8.jpg'),
          require('@/assets/img/swiper9.jpg'),
          require('@/assets/img/swiper11.jpg'),
          require('@/assets/img/swiper12.jpg'),
          require('@/assets/img/swiper13.jpg'),
          require('@/assets/img/swiper14.jpg'),
          require('@/assets/img/swiper15.jpg'),
          require('@/assets/img/swiper16.jpg'),
          require('@/assets/img/swiper17.jpg'),
          require('@/assets/img/swiper18.jpg'),
          require('@/assets/img/swiper19.jpg'),
          require('@/assets/img/swiper20.jpg'),
        ],
        end_list:[
          require('@/assets/img/end1.png'),
          require('@/assets/img/end2.png'),
          require('@/assets/img/end3.png'),
          require('@/assets/img/end4.png'),
          require('@/assets/img/end5.png'),
        ],
        list:[
          {
            time:35,
            process_img:require('../assets/img/swiper1.jpg'),
            process_text:'1921年  第一大',
            keywords:[
              {
                title:'中国共产党名称由来',
                pic:require('../assets/img/keyword0_0.jpg'),
                audio:require('../assets/media/keyword0_0.mp3'),
                question:'最早提出“中国共产党”这一名称的人是谁？',
                text:'最早提出“中国共产党”这一名称的是蔡和森。这一名称的最终确立不是一蹴而就的，而是经历了从社会党——共产党——中国共产党这样一个演变过程。在中国共产党第一次全国代表大会上，大会通过了党的第一个党纲，党纲确定党的名称为中国共产党。'
              },
              {
                title:'代表推选',
                pic:require('../assets/img/keyword0_1.jpg'),
                audio:require('../assets/media/keyword0_1.mp3'),
                question:'一大的13位代表是怎么推选出来的？',
                text:'1920年8月至1921年春，上海、北京、武汉、长沙、济南、广州等地先后建立起共产党早期组织。在欧洲和日本，中国留学生和侨民中的先进分子也建立了共产党早期组织。上海共产党早期组织的李达、李汉俊同陈独秀、李大钊通过书信商议，决定在上海召开党的第一次全国代表大会，并通知各地共产党早期组织各派两名代表来上海出席大会。接到开会通知后，除了旅法共产党早期组织因为路途遥远来不及派代表回国参加，其他各地共产党早期组织都积极响应，推派代表。'
              },
              {
                title:'最年轻的一大代表',
                pic:require('../assets/img/keyword0_2.jpg'),
                audio:require('../assets/media/keyword0_2.mp3'),
                question:'最年轻的一大代表是谁？',
                text:'在出席党的一大的13位代表中，最年长的是45岁的何叔衡，最年轻的是19岁的刘仁静。30岁以下的代表有9位，13位代表的平均年龄是28岁，毛泽东当年正好28岁。'
              },
            ]
          },
          {
            time:47,
            process_img:require('../assets/img/swiper2.jpg'),
            process_text:'1922年  第二大',
            keywords:[
              {
                title:'党章',
                pic:require('../assets/img/keyword1_0.jpg'),
                audio:require('../assets/media/keyword1_0.mp3'),
                question:'党的第一部正式党章是怎样诞生的？',
                text:'二大讨论通过了党的历史上第一部正式党章——《中国共产党章程》。这部党章遵循马克思主义建党学说基本原理，对党员条件、党的各级组织的建设和党的纪律作了具体规定，包括党员、组织、会议、纪律、经费和附则等6章内容，共29条。其中心是建立严密的各级组织，加强党的纪律性，标志着我们党从此有了自己的最高行为规范。'
              },
              {
                title:'全国党员人数',
                pic:require('../assets/img/keyword1_2.jpg'),
                audio:require('../assets/media/keyword1_2.mp3'),
                question:'召开二大时全国有多少名中国共产党员？是由哪些人组成的？',
                text:'当时全国有195名共产党员，出席会议的代表共12名。党的二大通过决议案，阐明中国共产党是无产阶级中最有革命精神的分子所组成的政党，是“为无产群众奋斗的政党”，强调党的一切运动都必须深入广大的群众中去，都必须是不离开群众的，这对建党初期工农运动的开展具有重要意义。'
              },
              {
                title:'第一位女性中央委员',
                pic:require('../assets/img/keyword1_1.jpg'),
                audio:require('../assets/media/keyword1_1.mp3'),
                question:'中国共产党第一位女性中央委员是谁？',
                text:'向警予是中国共产党唯一的一位女性创始人，向警予在二大当选为第一位女性中央委员，担任党中央第一任妇女部长，开始领导中国最早的无产阶级妇女运动。她还为党中央妇女部起草了许多重要指导文件，撰写了大量论述妇女运动的文章，培养了大批妇女工作干部，在妇女解放运动史上作出了不可磨灭的贡献。'
              },
            ]
          },
          {
            time:63,
            process_img:require('../assets/img/swiper3.jpg'),
            process_text:'1923年  第三大',
            keywords:[
              {
                title:'广州',
                pic:require('../assets/img/keyword2_0.jpg'),
                audio:require('../assets/media/keyword2_0.mp3'),
                question:'三大为何选址广州？',
                text:'1923年中共中央机关由上海迁至广州。广州是当时全国工人运动的中心，共产党在广东有较好的发展，且当时国民党和共产党的关系始终是比较良好的。所以，苏俄、共产国际将对华战略重心南移至当时国民党的活动中心——广州，正式确定孙中山为其在华合作对象，中国共产党决定接受共产国际的指示，召开党的三大以研究国共合作问题时，将会址选在广州，是再恰当不过了。'
              },
              {
                title:'秘密赴粤',
                pic:require('../assets/img/keyword2_2.jpg'),
                audio:require('../assets/media/keyword2_2.mp3'),
                question:'三大代表是怎样秘密赴粤的？',
                text:'中央规定参加三大的条件是：第一，主要是产业工人；第二，各区委书记可以来，但不要都来；第三，工运负责人。三大代表选出后，分批秘密赴粤。当时全国各地及莫斯科的与会代表近40人，以北方区委为例，选出的12名代表分三批走。为了保密，不坐同一条船，不乘同一趟车，不同一天走，但时间相隔不远。'
              },
              {
                title:'国际歌',
                pic:require('../assets/img/keyword2_1.jpg'),
                audio:require('../assets/media/keyword2_1.mp3'),
                question:'三大闭幕时代表们高唱的哪首歌，成为历届党代会闭幕式奏唱的歌曲？',
                text:'党的三大结束的当天，代表们来到黄花岗烈士墓前，在瞿秋白同志的指挥下高唱国际歌，中国共产党第三次代表大会就在雄壮有力的国际歌声中胜利闭幕了。在风起云涌的大革命中，《国际歌》的历史回响经久不息。也是从中共三大开始，在党的全国代表大会闭幕式上奏唱《国际歌》成为延续至今的传统。'
              },
            ]
          },
          {
            time:123,
            process_img:require('../assets/img/swiper7.jpg'),
            process_text:'1945年  第七大',
            keywords:[
              {
                title:'17年',
                pic:require('../assets/img/keyword3_0.jpg'),
                audio:require('../assets/media/keyword3_0.mp3'),
                question:'六大与七大为何整整相隔了17年？',
                text:'主要原因是：党和人民军队一直处于极其严酷恶劣的战争环境之下，党必须集中全力领导土地革命战争和全民族抗日战争。战争使根据地被分割、交通不便，许多党的高级干部都在第一线战斗，很难集中起来开会。同时，全党对于重大是非问题还没有形成一致看法。直到1945年整风运动结束后，以上问题基本得到解决，七大才得以顺利召开。'
              },
              {
                title:'毛泽东思想',
                pic:require('../assets/img/keyword3_1.jpg'),
                audio:require('../assets/media/keyword3_1.mp3'),
                question:'谁首先提出了“毛泽东思想”科学概念？有哪些标志意义？',
                text:'为纪念中国共产党诞生22周年和抗战6周年，王稼祥撰写了一篇具有历史意义的论著——《中国共产党与中国民族解放的道路》。在文章中，他首次提出“毛泽东思想”这一科学概念。七大的一个重要的贡献就是第一次明确地把毛泽东思想确立为全党的指导思想，并庄严地写入党章。它标志着马克思主义中国化的进程实现了第一次历史性飞跃，也标志着中国共产党在政治上、思想上和组织上达到了空前的团结、统一和成熟。'
              },
              {
                title:'最年轻的候补委员',
                pic:require('../assets/img/keyword3_2.jpg'),
                audio:require('../assets/media/keyword3_2.mp3'),
                question:'七届中央委员会成员中最年轻的候补委员是谁？',
                text:'七大选出了一位年仅31岁的中央候补委员，成为当时中央委员会最年轻的成员，他就是习仲勋。习仲勋是陕甘边革命根据地的主要创建者和领导者之一，他1934年11月当选陕甘边苏维埃政府主席时，年仅21岁。七大结束后不久，10月，根据毛泽东提议，由习仲勋主持西北局工作，任西北局书记、兼陕甘宁晋绥联防军代政治委员。毛泽东在向党内同志介绍他时说：“要选择一位年轻的同志担任西北局书记，就是习仲勋，他是从群众中走出来的群众领袖。”'
              },
            ]
          },
          {
            time:207,
            process_img:require('../assets/img/swiper12.jpg'),
            process_text:'1982年  第十二大',
            keywords:[
              {
                title:'历史转折',
                pic:require('../assets/img/keyword4_0.jpg'),
                audio:require('../assets/media/keyword4_0.mp3'),
                question:'为什么说党的十一届三中全会实现了伟大历史转折？',
                text:'中共十一届三中全会重新确立了党的马克思主义的路线和“解放思想、实事求是”的思想路线。从此，全党的工作重心由阶级斗争转移到经济建设上，逐步形成了以邓小平为核心的第二代领导集体，引领国家走上建设有中国特色的社会主义改革开放道路。'
              },
              {
                title:'入党誓词',
                pic:require('../assets/img/keyword4_1.jpg'),
                audio:require('../assets/media/keyword4_1.mp3'),
                question:'入党誓词首次载入党章有哪些意义？',
                text:'将入党誓词明确写入党章，体现了党对入党誓词的重视。是在党的工作重心向经济建设转移和改革开放的新局面下产生的，意在规范和完善发展党员程序，加强党员的理想信念教育。与之前的入党誓词相比，它更全面、系统、科学地概括了党对党员的要求和党员应承担的政治责任，具有党规党纪的性质，是每一位共产党员在入党时必须面对党旗作出的庄严承诺，对每一位共产党员都有约束力。'
              },
              {
                title:'新老交替',
                pic:require('../assets/img/keyword4_2.jpg'),
                audio:require('../assets/media/keyword4_2.mp3'),
                question:'十二大为何设立顾问委员会？',
                text:'顾问委员会，是中国共产党为解决党的中央领导机构新老交替而创设的一种组织形式，目的是逐步实现中央委员会的年轻化，同时让一些老同志在退出第一线之后继续发挥作用。设立顾问委员会这种办法，在党的历史上是一个创造。顾问委员会在1992年中共十四大圆满完成历史使命后撤销。'
              },
            ]
          },
          {
            time:273,
            process_img:require('../assets/img/swiper18.jpg'),
            process_text:'2012年  第十八大',
            keywords:[
              {
                title:'领导核心',
                pic:require('../assets/img/keyword5_0.jpg'),
                audio:require('../assets/media/keyword5_0.mp3'),
                question:'十八届六中全会正式提出“以习近平同志为核心的党中央”为什么至关重要？',
                text:'党的十八届六中全会根据马克思主义建党学说，提出“一个国家、一个政党，领导核心至关重要”的重要论断，并明确习近平同志为党中央、全党的核心，正式提出“以习近平同志为核心的党中央”。这对于维护党中央权威、维护党的团结和集中统一，对更好地凝聚党和人民的力量推进中国特色社会主义伟大事业和民族复兴大业，对保证党和国家兴旺发达、长治久安，具有十分重大而深远的意义。'
              },
              {
                title:'五位一体',
                pic:require('../assets/img/keyword5_1.jpg'),
                audio:require('../assets/media/keyword5_1.mp3'),
                question:'什么是“五位一体”？',
                text:'　　五位一体是十八大报告的“新提法”之一。经济建设、政治建设、文化建设、社会建设、生态文明建设——着眼于全面建成小康社会、实现社会主义现代化和中华民族伟大复兴，是党的十八大报告对推进中国特色社会主义事业作出“五位一体”总体布局。'
              },
              {
                title:'新面孔和新纪录',
                pic:require('../assets/img/keyword5_2.jpg'),
                audio:require('../assets/media/keyword5_2.mp3'),
                question:'十八大有哪些的新面孔和新纪录？',
                text:'农民工代表第一次以群体形象出现在党代会上。十八大代表选举工作启动之初，党中央就明确要求，要较大幅度提高工人党员代表比例，其中包括适当数量的农民工党员代表。此外，在党代会历史上，记者人数也首次超过代表人数。当时全国有8260万名党员，出席大会的代表2325人，而参与采访和报道这次会议的中外记者人数则多达2700多人。此外，在十九大时再次打破这一纪录，共有3068名中外记者前来采访，外国记者来自134个国家，比十八大时增加19.6%，充分展现了中国共产党开明开放的态度。'
              },
            ]
          },
          {
            time:309,
            process_img:require('../assets/img/swiper19.jpg'),
            process_text:'2017年  第十九大',
            keywords:[
              {
                title:'重大理论和战略思想',
                pic:require('../assets/img/keyword6_0.jpg'),
                audio:require('../assets/media/keyword6_0.mp3'),
                question:'十九大将哪些重大理论观点和重大战略思想写入党章？',
                text:'2017年10月24日，大会通过了关于《中国共产党章程（修正案）》的决议，“习近平新时代中国特色社会主义思想”写入党章。此外，写入党章的还有“四个自信”，“中国梦”，中国社会主要矛盾变化的重大政治判断，“五大发展理念”“四个全面”，十八大以来治国理政新经验，习近平强军思想、人类命运共同体、“一带一路”等，新时代管党治党要求和“四个意识”，“党领导一切”的政治原则。'
              },
              {
                title:'中国梦',
                pic:require('../assets/img/keyword6_1.jpg'),
                audio:require('../assets/media/keyword6_1.mp3'),
                question:'实现中华民族伟大复兴的中国梦有哪些内涵？',
                text:'实现中华民族伟大复兴的中国梦是习近平在中国共产党第十九次全国代表大会报告上提出的。中华民族伟大复兴中国梦是以习近平同志为核心的党中央提出的重大战略思想，是党和国家面向未来的政治宣言。习近平总书记对中国梦战略思想作出过系统阐释。他指出，实现全面建成小康社会、建成富强、民主、文明、和谐的社会主义现代化国家的奋斗目标，实现中华民族伟大复兴的中国梦，就是要实现国家富强、民族振兴、人民幸福。既深深体现了今天中国人的理想，也深深反映了我们先人们不懈追求进步的光荣传统。'
              },
              {
                title:'不忘初心、牢记使命',
                pic:require('../assets/img/keyword6_2.jpg'),
                audio:require('../assets/media/keyword6_2.mp3'),
                question:'十九大的主题提到不忘初心、牢记使命，初心和使命是什么？',
                text:'中国共产党人的初心和使命，就是为中国人民谋幸福，为中华民族谋复兴。这个初心和使命是激励中国共产党人不断前进的根本动力。'
              },
            ]
          },
        ],
        list_all:[
          {
            time:0,
            process_img:require('../assets/img/swiper0.jpg'),
            process_text:'前言'
          },
          {
            interview:1,
            time:35,
            process_img:require('../assets/img/swiper1.jpg'),
            process_text:'1921年  第一大'
          },
          {
            interview:2,
            time:47,
            process_img:require('../assets/img/swiper2.jpg'),
            process_text:'1922年  第二大'
          },
          {
            interview:3,
            time:63,
            process_img:require('../assets/img/swiper3.jpg'),
            process_text:'1923年  第三大'
          },
          {
            time:72,
            process_img:require('../assets/img/swiper4.jpg'),
            process_text:'1925年  第四大'
          },
          {
            time:88,
            process_img:require('../assets/img/swiper5.jpg'),
            process_text:'1927年  第五大'
          },
          {
            time:102,
            process_img:require('../assets/img/swiper6.jpg'),
            process_text:'1928年  第六大'
          },
          {
            interview:4,
            time:123,
            process_img:require('../assets/img/swiper7.jpg'),
            process_text:'1945年  第七大'
          },
          {
            time:154,
            process_img:require('../assets/img/swiper8.jpg'),
            process_text:'1956年  第八大'
          },
          {
            time:170,
            process_img:require('../assets/img/swiper9.jpg'),
            process_text:'1969年  第九大'
          },
          {
            time:180,
            process_img:require('../assets/img/swiper11.jpg'),
            process_text:'1977年  第十一大'
          },
          {
            interview:5,
            time:207,
            process_img:require('../assets/img/swiper12.jpg'),
            process_text:'1982年  第十二大'
          },
          {
            time:217,
            process_img:require('../assets/img/swiper13.jpg'),
            process_text:'1987年  第十三大'
          },
          {
            time:230,
            process_img:require('../assets/img/swiper14.jpg'),
            process_text:'1992年  第十四大'
          },
          {
            time:236,
            process_img:require('../assets/img/swiper15.jpg'),
            process_text:'1997年  第十五大'
          },
          {
            time:244,
            process_img:require('../assets/img/swiper16.jpg'),
            process_text:'2002年  第十六大'
          },
          {
            time:248,
            process_img:require('../assets/img/swiper17.jpg'),
            process_text:'2007年  第十七大'
          },
          {
            interview:6,
            time:273,
            process_img:require('../assets/img/swiper18.jpg'),
            process_text:'2012年  第十八大'
          },
          {
            interview:7,
            time:309,
            process_img:require('../assets/img/swiper19.jpg'),
            process_text:'2017年  第十九大'
          },
          {
            time:356,
            process_img:require('../assets/img/swiper20.jpg'),
            process_text:'2021年  建党100周年'
          },
        ],
        result_list:[0,0,0,0,0,0,0]
      }
    },
    watch: {
      activeIndex(newValue) {
        this.interviewIndex = this.list_all[newValue].interview;
        
        // if(this.interviewIndex){
        //   this.keywords_now=this.list[this.interviewIndex-1].keywords;
        //   this.interview=require('../assets/img/interview'+this.interviewIndex+'.png');
        // }
      },
      audio(newValue){
        console.log('audio',newValue);
      },
      audio_bg(newValue){
        console.log('audio_bg',newValue);
      }
    },
    created () {
      let len = this.preload.length;
      let count = 0;
      let preload = this.preload;
      let percent=0;
      load(()=>{
        this.loading_num =100;
        this.loading=false;
        this.start_show=true;
      },
      (num)=>{
        this.loading_num=num
      });
      function load(cb1,cb2){
        var img=new Image();
        img.src=preload[count]; 
        img.onload=()=>{
          if (count == len-1) {                    
            // this.loading_num =100;
            // this.loading=false;
            // this.start_show=true;
            !!cb1 && cb1();
          } else{
            percent = Math.floor(count/preload.length*100);
            !!cb2 && cb2(percent);
            count++;
            load(cb1,cb2);
          } 
        }
      }
      this.keywords_now = this.list[0].keywords;
      this.keyword_detail = this.keywords_now[0]
      document.onkeydown = (event)=> {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        let key = e.keyCode;
        if (key == 8) { //返回
          // this.audio.currentTime=0;
          // this.audio.pause();
          // if(this.process_show){
          //   this.process_show=false;
          //   this.play();
          // }
          // if(this.interview_show || this.keyword_show){
          //   this.audio_bg.currentTime=0
          //   this.audio_bg.pause();
          //   if(this.activeIndex<this.list_all.length-1){this.activeIndex++;}
          //   this.hideAll();
          //   this.play();
          // }
        }
        if (key == 13) { //确定
          if(this.start_show){
            this.start_show=false;
            this.play();
          }
          if(this.process_show){
            this.activeIndex=this.swiperItem.activeIndex;
            this.videoEl.currentTime=this.list_all[this.activeIndex].time - 3;
            this.play();
            this.process_show=false
          }
          if(this.interview_show){
            clearTimeout(this.interviewTimer);
            this.interview_show=false;
            setTimeout(() => {
              this.keyword_show=true;
            }, 300);
          }
          if(this.keyword_show && !this.back_show){
            this.keyword_detail = this.list[this.interviewIndex-1]['keywords'][this.keyword_index];
            this.keyword_show=false;
            this.keyword_index=0;
            setTimeout(()=>{
              this.voice_show=true;
            },300)
            this.audio = document.getElementById('audio');
            this.audio.src=this.keyword_detail.audio
            this.audio.play();
          }
          if(this.keyword_show && this.back_show){
            this.keyword_show=false;
            this.default_show=false;
            this.keyword_index=0;
            this.back_show=false;
            this.audio_bg.currentTime=0;
            this.audio_bg.pause();
            if(this.activeIndex<this.list_all.length-1){this.activeIndex++;}
            this.play();
          }
          if(this.voice_show){
            this.audio.currentTime=0;
            if(this.result_list[this.interviewIndex-1]==0){
              this.result_list[this.interviewIndex-1]=1;
              this.showStar();
            }else{
              this.hideAll();
              this.audio_bg.currentTime=0;
              this.audio_bg.pause();
              this.audio.currentTime=0;
              this.audio.pause()
              if(this.activeIndex<this.list_all.length-1){this.activeIndex++;}
              this.play();
            }
          }
          if(this.end_show && this.retry_show){
            this.reset();
          }
        }
        if(key==40){//向下
          if(this.noDialog() && !this.start_show && !this.loading){
            this.showProcess();
            this.pause(); 
          }
          if(this.keyword_show){
            this.back_show=true;
            this.keyword_index=3;
          }
          if(this.voice_show){
            this.voice_text.scrollTop+=200;
          }
          if(this.end_show){
            this.retry_show=true;
            this.endActiveIndex=-1;
            this.slideEndTo(0);
          }
        }
        if(key==38){//向上
          if(this.process_show){
            this.process_show=false;
            this.play();
          }
          if(this.keyword_show){
            this.back_show=false;
            this.keyword_index=0;
          }
          if(this.voice_show){
            this.voice_text.scrollTop-=200;
          }
          if(this.end_show){
            this.retry_show=false;
            this.endActiveIndex=0;
            this.slideEndTo(0);
          }
        }
        if(key==39){//向右
          if(this.process_show){
            this.slideNext();
          }
          if(this.keyword_show && this.keyword_index<2){
            this.keyword_index++;
          }
          if(this.end_show){
            this.slideEndNext();
          }
        }
        if(key==37){//向左
          if(this.process_show){
            this.slidePrev();
          }
          if(this.keyword_show && this.keyword_index>0){
            this.keyword_index--;
          }
          if(this.end_show){
            this.slideEndPrev();
          }
        }
      };
      
    },
    components: {
      swiper,
      swiperSlide
    },
    mounted() {
      this.$nextTick(()=>{
        this.keycode = `characterSet::${document.characterSet};;language::${window.navigator.language}`;
        this.videoEl = this.$refs.video;
        this.audio_bg = document.getElementById('audio_bg');
        this.audio = document.getElementById('audio');
        this.swiperItem=this.$refs.swiper.swiper;
        this.swiperEndItem=this.$refs.swiperEnd.swiper;
        this.voice_text = this.$refs.voice_text
        this.videoEl.addEventListener("ended", ()=>{
          this.hideAll();
          this.end_show=true;
          this.swiperEndItem=this.$refs.swiperEnd.swiper;
          this.endActiveIndex=0;
          this.$nextTick(()=>{
            this.slideEndTo(this.endActiveIndex)
          })
          let arr = this.result_list.filter((v)=>{return v==1})
          this.result = arr.length;
          this.creatQrCode()
        }, false)
        this.videoEl.addEventListener("timeupdate", ()=>{
          let cur=this.videoEl.currentTime;
          if(cur>27){
            this.star_top_show=true;
          }
          if(this.activeIndex<this.list_all.length-1 && cur>this.list_all[this.activeIndex].time && this.noDialog()){
            if(this.interviewIndex){
              this.pause();
              this.keywords_now=this.list[this.interviewIndex-1].keywords;
              this.interview_show=true;
              this.audio_bg.play();
              this.default_show=true;
              this.interviewTimer = setTimeout(() => {
                this.interview_show=false;
                this.default_show=false;
                this.audio_bg.currentTime=0;
                this.audio_bg.pause();
                this.activeIndex++;
                this.play()
              }, 5000);
            }else {
              this.activeIndex++;
            }
          }
        }, false);
        this.audio.addEventListener("ended", ()=>{
          console.log('audio ended')
          this.voice_show=false;
          this.default_show=false;
          if(this.result_list[this.interviewIndex-1]==0){
            this.result_list[this.interviewIndex-1]=1;
            this.showStar();
          }else{
            this.hideAll();
            this.audio_bg.currentTime=0;
            this.audio_bg.pause();
            this.audio.currentTime=0;
            this.audio.pause()
            if(this.activeIndex<this.list_all.length-1){this.activeIndex++;}
            this.play();
          }
        }, false)
        window.addEventListener("hashchange", e=>{
          this.keycode = location.hash
          if (window.location.hash !== '#home') return
          this.process_show=false;
          this.play();
        }, false)
      })
    },
    methods: {
      start(){
        this.start_show=false;
        this.play();
      },
      backHome() {
        this.process_show=false;
        this.play();
      },
      portal() {
        this.activeIndex=this.swiperItem.activeIndex;
        this.videoEl.currentTime=this.list_all[this.activeIndex].time - 3;
        this.play();
        this.process_show=false
      },
      clearKeyword() {
        this.keyword_show=false;
        this.default_show=false;
        this.keyword_index=0;
        this.back_show=false;
        this.audio_bg.currentTime=0;
        this.audio_bg.pause();
        if(this.activeIndex<this.list_all.length-1){this.activeIndex++;}
        this.play();
      },
      play() {
        this.videoEl.play();
      },
      pause(){
        this.videoEl.pause();
      },
      slideTo(n){
        this.swiperItem.slideTo(n)
      },
      slideNext(){
        if(this.swiperItem.activeIndex<this.list_all.length-1){
          this.swiperItem.slideNext()
        } 
      },
      slidePrev(){
        this.swiperItem.slidePrev()
      },
      slideEndNext(){
        if(this.retry_show){
          return;
        }
        if(this.endActiveIndex==3){
          this.slideEndTo(4);
        }

        if(this.endActiveIndex<4){
          this.endActiveIndex++
        }
      },
      slideEndTo(n){
        this.swiperEndItem.slideTo(n)
      },
      slideEndPrev(){
        if(this.retry_show){
          return;
        }
        if(this.endActiveIndex==1){
          this.slideEndTo(0)
        }
        if(this.endActiveIndex>0){
          this.endActiveIndex--
        }
        
      },
      showProcess(){
        location.hash = "process"
        this.process_show=true;
        this.swiperItem=this.$refs.swiper.swiper;
        this.$nextTick(()=>{
          this.slideTo(this.activeIndex)
        })
      },
      hideAll(){
        this.process_show=false;
        this.keyword_show=false;
        this.end_show=false;
        this.star_show=false;
        this.voice_show=false;
        this.interview_show=false;
        this.default_show=false;
        this.retry_show=false
      },
      noDialog(){
        return this.process_show==false && this.keyword_show==false && this.end_show==false && this.star_show==false && this.voice_show==false && this.interview_show==false && this.default_show==false;
      },
      showStar(){
        this.star_show=true;
        this.audio.currentTime=0;
        this.audio.pause();
        setTimeout(()=>{
          this.star_show=false;
          if(this.activeIndex<this.list_all.length-1){this.activeIndex++;}
          this.hideAll();
          this.audio_bg.currentTime=0;
          this.audio_bg.pause();
          this.play();
        },3000)
      },
      reset(){
        this.hideAll();
        this.activeIndex=0;
        this.videoEl.currentTime=0;
        this.play();
        // this.result_list=[0,0,0,0,0,0,0]
      },
      creatQrCode() {
        this.$refs.qrCodeUrl.innerHTML="";
        let str=this.result_list.join('');
        let code=Math.round((Math.random() + 1) * 0x10000).toString(16)+''+new Date().getTime()
          var qrcode = new QRCode(this.$refs.qrCodeUrl, {
            width: 140,
            height: 140,
            text: 'http://3d.ziyakeji.com/prize/?source=tv&score='+str+'&qrcode='+code,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  @keyframes turn{
    from{-webkit-transform:rotate(0deg);}
    to{-webkit-transform:rotate(360deg);}
  }
  .fade-enter{
    opacity: 0;
  }
  .fade-enter-active{
    transition: opacity 0.2s;
  }
  .wrap{
    width:100%;
    height:100%;
    position:relative;
    display:flex;
    justify-content: center;
    align-items: center;
    .video_wrap{
      position: relative;
      z-index: 1;
      padding: 0;
      line-height: 0;
      >video{
        width:100vw;
      }
      .interview{
        position:absolute;
        z-index: 2;
        top:2.4rem;
        left:3rem;
        width:4.8rem;
        height:3.85rem;
      }
    }
  }
  .keycode{
    position:absolute;
    top:2rem;
    left:2rem;
    font-size:0.5rem;
    color:#fff;
    z-index: 10;
  }
  .audio,.audio_bg{
    width:0;
    height:0;
  }
  .star_result{
    width:5.3rem;
    position:absolute;
    z-index: 3;
    top:0.9rem;
    right:1.2rem;
    font-size:0.37rem;
    color:#a53c3e;
    display:flex;
    align-items: center;
    height:0.44rem;
    .star_item{
      width:0.46rem;
      height:0.44rem;
      margin-left:0.08rem;
      >img{
        width:0.45rem;
      }
    }
  }
  .review{
    width:3.06rem;
    position:absolute;
    bottom:0.5rem;
    right:1.2rem;
    z-index: 3;
  }
  .keyword_wrap,.voice_wrap,.star_wrap,.end_wrap,.process_wrap,.interview_wrap,.loading{
    position:absolute;
    z-index: 2;
    background:rgba(0,0,0,0.9);
    width:100%;
    height:100%;
    color:#fff;
  }
  .bg{
    position:absolute;
    z-index: 2;
    background:url(../assets/img/bg_loading.jpg) no-repeat center;
    background-size:cover;
    width:100%;
    height:100%;
  }
  .loading{
    display:flex;
    align-items: center;
    justify-content: center;
    font-size:0.3rem;
    color:#fff;
    .loading_main{
      width:1.6rem;
      text-align:center;
    }
    .loading_img{
      width:0.66rem;
      display:block;
      margin:0 auto 0.2rem;
      animation:turn 1s linear infinite;   
    }
    >span{
      color:#000;
      font-size:1rem;
    }
  }
  .interview_bg{
    z-index: 6;
    top:0;
    left:0;
  }
  .interview_wrap{
    z-index: 0;
  }
  .start_wrap{
    position:absolute;
    width:100%;
    height:100%;
    z-index: 2;
    background:rgba(0,0,0,0.9) url(../assets/img/start.png) no-repeat center;
    background-size:8rem;
  }
  .process_wrap{
    background:c url(../assets/img/swiper_bg.png) no-repeat bottom left;
    border:none;
    outline: none;
    .hand {
      position: absolute;
      left: 50%;
      top: .8rem;
      transform: translateX(-50%);
      width: 3.68rem;
      height: .6rem;
      background: rgba(255,255,0,0.8);
      border-radius: .3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: .3rem;
      >span {
        display: block;
        margin-left: .1rem;
      }
      >img {
        width: .32rem;
      }
    }
    .swiper{
      width:100%;
      position:absolute;
      bottom:0.9rem;
      left:0;
      border:none;
      outline: none;
    }
    /deep/ .swiper-wrapper{
      border:none;
      outline: none;
    }
    .swiper_item{
      width:4.3rem;
      height:2.42rem;
      display:flex;
      align-items: center;
      justify-content: center;
      >img{
        max-width:3.9rem;
      }
    }
    .text{
        font-size:0.32rem;
        color:rgba(255,255,255,0.3);
        line-height:0.6rem;
        display:flex;
        align-items: center;
        justify-content: center;
        >img{
          height:0.28rem;
          margin-left:0.06rem;
        }
      }
    .swiper-slide-active{
      img.swiper_img{
        max-width:4.3rem;
        height: 100%;
        vertical-align: middle;
      }
      .swiper_item {
        border:0.03rem solid #f5e06b;
      }
      .text{
        color:#f5e06b;
      }
    }

  }
  .keyword_wrap{
    .title{
      display:block;
      height:0.82rem;
      margin:1.7rem auto 0.76rem; 
    }
    .keywords{
      width:100%;
      height:5.26rem;
      padding:0 0.9rem;
      box-sizing: border-box;
      display:flex;
      justify-content: space-around;
      align-items: center;
      .keyword_main{
        display:flex;
        align-items: center;
        justify-content: center;
        height: 5.26rem;
        flex:1;
      }
      .keyword{
        width:4.6rem;
        height:4.2rem;
        background:url(../assets/img/keyword.jpg) no-repeat left top;
        background-size:100%;
        overflow: hidden;
        display:flex;
        align-items: center;
        justify-content: center;
        >p{
          color:#601112;
          font-size:0.56rem;
          line-height:0.72rem;
          text-align:center;
          width:2.9rem;
        }
        &.active{
          transform: scale(1.1);
          border:0.03rem solid #f5e06b;
          box-shadow:0 0 0.3rem #feffbb;
        }
      }
    }
    .back{
      width:1.93rem;
      position:absolute;
      bottom:0.5rem;
      right:1.6rem;
    }
  }
  .voice_wrap{
    .title{
      font-size:0.72rem;
      margin:0.9rem 0 0.36rem;
      height:0.72rem;
      display:flex;
      align-items: center;
      justify-content: center;
      color:#feffbb;
    }
    .voice_main{
      width:16rem;
      height:6.9rem;
      margin:0 auto;
      background:url(../assets/img/result.jpg) no-repeat center;
      background-size:100%;
      position:relative;
      display:flex;
      .img_wrap{
        width:5.32rem;
        height:5.28rem;
        display:flex;
        align-items: center;
        justify-content: center;
        margin:0.8rem 0.5rem 0 1rem;
        position:relative;
        .voice_img{
          max-width:5.32rem;
          max-height:5.28rem;
        }
        .voice_icon{
          width:0.78rem;
          position:absolute;
          bottom:0;
          right:0;
        }
      }
      .text{
        width:7.9rem;
        height:5.32rem;
        overflow: auto;
        margin-top:0.8rem;
        outline:none;
        &::-webkit-scrollbar-track-piece{background-color: rgba(0,0,0,0); border-left: 1px solid rgba(0,0,0,0);}
        &::-webkit-scrollbar{width: 5px; -webkit-border-radius:5px; -moz-border-radius: 5px; border-radius: 5px;}
        &::-webkit-scrollbar-thumb{background-color: rgba(0,0,0,0.5); background-clip: padding-box; -webkit-border-radius:5px; -moz-border-radius: 5px; border-radius: 5px; min-height: 28px;}
        &::-webkit-scrollbar-thumb:hover{background-color: rgba(0,0,0,0.5); -webkit-border-radius:5px; -moz-border-radius: 5px; border-radius: 5px;}
        .tit{
          font-size:0.44rem;
          color:#601112;
          display:flex;
          line-height:0.52rem;
          align-items: center;
          margin-bottom:0.1rem;
        }
        .detail{
          font-size:0.36rem;
          color:#601112;
          line-height:0.48rem;
          text-align:left;
        }
      }
    }
    .back{
      width:1.93rem;
      position:absolute;
      bottom:0.5rem;
      right:1.6rem;
    }
  }
  .star_wrap{
    .star_icon{
      display: block;
      width:8.8rem;
      margin:1.2rem auto 0;
    }
    // .star_tit{
    //   font-size:0.75rem;
    //   display:flex;
    //   height:1.2rem;
    //   align-items: center;
    //   justify-content: center;
    //   margin-bottom:0.3rem;
    // }
    // .star_text{
    //   font-size:0.54rem;
    //   display:flex;
    //   height:0.54rem;
    //   align-items: center;
    //   justify-content: center;
    // }
  }
  .end_wrap{
    padding-left:1.2rem;
    color:#fff;
    box-sizing: border-box;
    background:rgba(0,0,0,0.9);
    .title{
      font-size:0.4rem;
      margin:0.84rem 0 0.2rem;
      display:flex;
      height:0.6rem;
      align-items: center;
      color:#fff;
    }
    .img_wrap{
      width:100%;
      height:6rem;
      padding-right: 1rem;
      box-sizing: border-box;
      position:relative;
      display:flex;
      align-items: center;
      border:none;
      outline: none;
      .swiper{
        width:100%;
        height:6rem;
        position:absolute;
        left:0;
        display:flex;
        align-items: center;
        border:none;
        outline: none;
      }
      /deep/ .swiper-wrapper{
        border:none;
        outline: none;
      }
      .swiper-slide{
        display:flex;
        align-items: center;
        justify-content: flex-end;
      }
      .swiper_item{
        width:3.6rem;
        height:6rem;
        display:flex;
        align-items: center;
        justify-content: center;
        >img{
          width: 3.54rem;
        }
        &.active{
          transform: scale(1.1);
          >img {
            border:0.03rem solid #f5e06b;
            border-radius:0.12rem;
          }
        }
      }
      // .swiper-slide-active{
      //   .swiper_item{
      //     width:4rem;
      //     height:6rem;
      //     display:flex;
      //     align-items: center;
      //     justify-content: center;
      //     >img{
      //       width:4rem;
      //       border:0.02rem solid #f5e06b;
      //       vertical-align: middle;
      //       border-radius:0.12rem;
      //     }
      //   }
      // }
    }
    .text_wrap{
      height:2rem;
      overflow:hidden;
      line-height:0;
    }
    .text{
      font-size:0.4rem;
      margin:0.2rem 0 0.35rem;
      display:flex;
      height:0.4rem;
      align-items: center;
      >span{
        color:#f5e06b;
      }
    }
    .star{
      position:relative;
      display:flex;
      align-items: center;
      margin-top:0.4rem;
      height:2rem;
      .erweima{
        width:2rem;
        height:2rem;
        margin-right:0.56rem;
        background-color: #fff; //设置白色背景色
        padding: 0.1rem; // 利用padding的特性，挤出白边
        border-radius:0.1rem;
        /deep/ canvas {
          width:2rem;
        }
        /deep/ img {
          width:1.8rem;
          margin:0;
          border:0.1rem solid #fff;
        }
      }
      .star_item{
        display:inline-block;
        width:0.78rem;
        height: 0.8rem;
        margin-right:0.12rem;
        vertical-align: middle;
        img{
          width:0.78rem;
        }
      }
      .retry{
        width:3.06rem;
        position:absolute;
        bottom:0.3rem;
        right:1.2rem;
      }
    }
  }

</style>