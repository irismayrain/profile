import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import { getProfile, parseSocials } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  const profile = getProfile();
  const name = profile?.name ?? "Iris";
  const email = profile?.email ?? "";
  const socials = profile ? parseSocials(profile.socials) : [];
  const github = socials.find(
    (s) => /github/i.test(s.label) || /github/i.test(s.url)
  );

  return (
    <div className="min-h-screen pt-5">
      <SiteNav name={name} />

      <main className="mx-auto w-full max-w-[680px] px-5 pb-24 pt-8 md:px-9">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-mute transition-colors hover:text-lav-500"
        >
          <span className="font-serif-ac text-lav-400">←</span>
          back home
        </Link>

        <header className="fade-up mt-10">
          <p className="mono-label">letter · 自述</p>
          <h1 className="mt-3 text-[36px] font-medium leading-[1.15] tracking-tightest text-ink md:text-[44px]">
            <span className="font-cn">你好，我是</span>
            <span className="ml-2 font-serif-ac text-[42px] text-lav-500 md:text-[50px]">
              Iris
            </span>
            <span className="font-cn">。</span>
          </h1>
          <div className="mt-6 h-px w-16 bg-lav-200" />
        </header>

        <article className="fade-up mt-10 font-cn text-[15px] leading-[1.95] text-ink-soft">
          <p>我走到今天的路，说起来有点绕。</p>

          <p className="mt-5">
            金融本科毕业，却一直想做产品。20 岁那年，我成了一家创业公司的创始团队第一个员工——
            做的第一件事，是用图像识别把玩家的游戏战绩扫描成一个社交主页。那是 2016 年，
            方法土得可爱：没有现成的模型，我就把界面上每个数据的坐标，一个一个手工标进 Excel，
            再让 App 去读。后来我们用它做了找队友、做了 Overwatch 的英雄主页……
            那是我第一次知道，原来「从一个真问题出发，把它做出来」是这么让人着迷的事。
          </p>

          <p className="mt-5">
            再后来，我阴差阳错被从产品调去做运营、做教学，离那个 title 越来越远。
          </p>

          <p className="mt-5">有很长一段时间，我以为自己把路走岔了。</p>

          <p className="mt-5">
            直到最近我才想明白一件事：
            <strong className="font-semibold text-ink">
              我其实从来没离开过产品，只是没顶着那个名字。
            </strong>
          </p>

          <Divider />

          <p>
            我做东西的起点，几乎都一样——「我，或者我身边的人，真的被某个问题卡住了」：
          </p>

          <ul className="mt-5 flex flex-col gap-4">
            <li className="border-l-2 border-lav-200 pl-4">
              我先生有 4 万字的工作笔记，Notion 没有 AI、ChatGPT 又记不住他。
              于是我给他做了一个会长期记忆、改任何东西前都要先问过他的「第二大脑」。
            </li>
            <li className="border-l-2 border-lav-200 pl-4">
              我自己读书时，想要一个能
              <strong className="font-semibold text-ink">
                接住我、但不替我思考
              </strong>
              的 AI——不当助手、不当老师、更不当治疗师，就当个朋友。于是有了 Linger。
            </li>
            <li className="border-l-2 border-lav-200 pl-4">
              我研究塔罗、又是画画出身，想要一副保留韦特意象、却换了画风的牌。
              于是我自己画了 22 张大阿卡纳。
            </li>
          </ul>

          <p className="mt-6">
            这两年，我独立做了 5 个 0→1 的 AI 产品（有的开源、有的还在自己用），
            也在一门真实的家居生意里，从 0 搭起一套 AI 驱动的数字化系统（商品问答 → 内部 CRM → AI 内容生产）。我不只是写 PRD——
            我会自己上手把它跑起来，因为我实在太想知道「这个想法到底成不成立」了。
          </p>

          <Divider />

          <p>对于 AI，我有一个有点固执的信念：</p>

          <p className="mt-5">
            它应该
            <strong className="font-semibold text-ink">
              增强一个人真实的表达，而不是替他造一个假的自己
            </strong>
            ；它该接住人，但不替人想；在危机的时刻，最后一定要有一个真人能接得住——
            这些「不能出错」的地方，我宁可把它们硬编码下来，也不愿交给一个黑箱去自由发挥。
          </p>

          <p className="mt-5">
            我想，这大概就是我做产品的底色：技术可以很酷，但它得
            <strong className="font-semibold text-ink">对人是温柔的、是诚实的</strong>。
          </p>

          <Divider />

          <p>
            我是金融出身，做过运营，当过主播，会画画，研究塔罗，也写点东西（很荣幸成了
            「人人都是产品经理」的主编推荐作者）。这些以前看起来七零八落的标签，
            我曾经觉得是「绕路」——
          </p>

          <p className="mt-5">
            现在我知道，它们一直在往同一个地方走：
            <strong className="font-semibold text-ink">
              一个既真的懂用户、又能亲手把东西做出来的 AI 产品人。
            </strong>
          </p>

          <p className="mt-5">绕了挺远。但好像，正好，全都用上了。</p>

          <p className="mt-10 font-serif-ac text-[19px] italic leading-[1.6] text-lav-500">
            嘿，很高兴你看到这里。我们聊聊？ :）
          </p>
        </article>

        <footer className="mt-12 border-t border-dashed border-line pt-6">
          <p className="font-serif-ac text-[22px] text-lav-500">—— Iris</p>
          <div className="mt-4 flex flex-col gap-1.5 font-mono text-[12px] text-ink-mute">
            {email && (
              <a
                className="inline-flex items-center gap-2 transition-colors hover:text-lav-500"
                href={`mailto:${email}`}
              >
                <span className="text-ink-mute">📮</span>
                {email}
              </a>
            )}
            {github && (
              <a
                className="inline-flex items-center gap-2 transition-colors hover:text-lav-500"
                href={github.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-ink-mute">↗</span>
                GitHub · {github.url.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </footer>

        <div className="mt-16 flex items-center justify-between font-mono text-[11px] text-ink-mute">
          <Link href="/" className="hover:text-lav-500">
            ← home
          </Link>
          <span className="font-serif-ac text-lav-400">— end —</span>
          <Link href="/experience" className="hover:text-lav-500">
            experience →
          </Link>
        </div>
      </main>

      <Footer name={name} />
    </div>
  );
}

function Divider() {
  return (
    <div className="my-10 flex items-center gap-3">
      <span className="h-px flex-1 bg-line" />
      <span className="font-serif-ac text-[14px] text-lav-300">·</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
