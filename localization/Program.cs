using System;
using System.IO;
using System.Xml;
using net.sf.saxon.serialize;
using Newtonsoft.Json;
using Saxon.Api;


namespace updateLocalization
{
	class Program
	{
		static void Main(string[] args)
		{
			// Press Ctrl+F5 (or go to Debug > Start Without Debugging) to run your app.
			CreateEnglish20Xlf();
			AddMissing12LangFolders();
			CreateModel();
			CreateReducer();
			CreateEnglishStrings();
			CreateOtherLangStrings();
			CombineStrings();
			CleanUp();
		}

		private static void CreateEnglish20Xlf()
		{
			XsltProcess(@"From12To20.xsl", @"TranscriberAdmin-en.xlf");
		}

		private static void AddMissing12LangFolders()
		{
			foreach (var fileInfo in new DirectoryInfo(@"..\..").GetFiles("TranscriberAdmin-*.xlf"))
			{
				var langTag = Path.GetFileNameWithoutExtension(fileInfo.Name).Substring(17);
				if (langTag == "en") continue;
				var langDir = new DirectoryInfo(@"..\..\" + langTag);
				if (!langDir.Exists)
				{
					langDir.Create();
					var dataFile = new StreamReader(@"..\..\TranscriberAdmin-en-1.2.xliff");
					var data = dataFile.ReadToEnd();
					dataFile.Close();
					var result = data.Replace(@"target-language=""en""", @"target-language=""" + langTag + @"""");
					var outData = new StreamWriter(@"..\..\" + langTag + @"\TranscriberAdmin-en-1.2.xliff");
					outData.Write(result);
					outData.Close();
				}
			}
		}

		private static void CreateModel()
		{
			XsltProcess(@"ToModel.xsl", @"localizeModel.tsx");
		}

		private static void CreateReducer()
		{
			XsltProcess(@"ToReducer.xsl", @"localizationReducer.tsx");
		}

		private static void CreateEnglishStrings()
		{
			XsltProcess(@"MakeStrings-12.xsl", @"TranscriberAdmin-en-1.2.xml");
		}

		private static void CreateOtherLangStrings()
		{
			foreach (var fileInfo in new DirectoryInfo(@"..\..").GetFiles("TranscriberAdmin-*.xlf"))
			{
				var langTag = Path.GetFileNameWithoutExtension(fileInfo.Name).Substring(17);
				var langDir = new DirectoryInfo(@"..\..\" + langTag);
				if (!langDir.Exists) continue;
				XsltProcess(@"MakeStrings-12.xsl", @"TranscriberAdmin-en-1.2-" + langTag + @".xml", langTag + @"\TranscriberAdmin-en-1.2.xliff");
			}
		}

		private static void CombineStrings()
		{
			XsltProcess(@"CombineStrings-12.xsl", @"strings.xml");
			var xmlDoc = new XmlDocument();
			xmlDoc.Load(@"..\..\strings.xml");
			var json = JsonConvert.SerializeXmlNode(xmlDoc.DocumentElement);
			using (var sw = new StreamWriter(@"..\..\strings.json"))
			{
				sw.Write(json.Substring(11, json.Length - 12));
			}
		}

		private static void XsltProcess(string xslName, string outName, string inName = "TranscriberAdmin-en-1.2.xliff")
		{
			var inputInfo = new FileInfo(@"..\..\" + inName);
			var xsltInfo = new FileInfo(@"..\..\" + xslName);

			// Create a Processor instance
			var processor = new Processor();

			// Load the source
			var input = processor.NewDocumentBuilder().Build(new Uri(inputInfo.FullName));

			// Create a transformer for the stylesheet.
			var transformer = processor.NewXsltCompiler().Compile(new Uri(xsltInfo.FullName)).Load30();

			// Create a serializer, with output to the standard output stream
			var serializer = processor.NewSerializer();

			using (var textWriter = new StreamWriter(@"..\..\" + outName))
			{
				serializer.SetOutputWriter(textWriter);

				// Transform the source XML and serialize the result document
				transformer.ApplyTemplates(input, serializer);
			}
		}

		private static void CleanUp()
		{
			foreach (var fileInfo in new DirectoryInfo(@"..\..").GetFiles("TranscriberAdmin-*.xlf"))
			{
				var langTag = Path.GetFileNameWithoutExtension(fileInfo.Name).Substring(17);
				var langDir = new DirectoryInfo(@"..\..\" + langTag);
				if (!langDir.Exists) continue;
				new DirectoryInfo(@"..\..\" + langTag).Delete(true);
			}

			foreach (var fileInfo in new DirectoryInfo(@"..\..\").GetFiles(@"*.xml"))
			{
				new FileInfo(fileInfo.FullName).Delete();
			}
		}

	}
}
