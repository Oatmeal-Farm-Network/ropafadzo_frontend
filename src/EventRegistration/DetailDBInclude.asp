<% 	prodID= Request.QueryString("prodID") 
	

dim buttonimages(20)
dim buttontitle(20)

			
	Set rsA = Server.CreateObject("ADODB.Recordset")
	sql = "select * from sfProducts where prodID='" & prodID & "'"
	'response.write(sql)
	rsA.Open sql, conn, 3, 3 
	Description = rsA("prodDescription")
prodname = rsA("prodname")


	str1 = Description
str2 = vblf
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , "</br>")
End If  

str1 = Description
str2 = vbtab
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  


	           If Len(rsA("ProdImage1")) < 2 And Len(rsA("ProdImage2"))< 2  And Len(rsA("ProdImage3")) < 2  And Len(rsA("ProdImage4")) < 2  And Len(rsA("ProdImage5")) < 2 And Len(rsA("ProdImage6")) < 2  And Len(rsA("ProdImage7")) < 2  And Len(rsA("ProdImage8")) < 2 then 
				click = "<img width=""260"" src=""/Uploads/NotAvailable.jpg""> "
				noimage = True
				  ' response.write("found")
				Else 
						noimage = false

		End If
	
	if not rsA.eof then 

	pcounter = 0
	counter = 0
	counttotal = 8
	foundimagecount = 0
	While counter < counttotal
		'response.write("counter=")
		'response.write(counter)

		counter = counter +1

		Photonum = "ProdImage" & counter
		Captionnum = "PhotoCaption" & counter
		image = rsA(Photonum)
	
		If Len(image)> 2 Then
		foundimagecount =foundimagecount  + 1
		pcounter = pcounter +1
		buttonimages(pcounter) = "/Uploads/" & image
		buttontitle(pcounter) = Caption
		'response.write(buttonimages(counter))
%>
<script language="JavaScript">
               if (document.images) version = "n3";
               else version = "n2";
               if (version == "n3") {
				but<%=pcounter%>on = new Image(85, 115);
				but<%=pcounter%>on.src = "/Uploads/<%=image%>";
			   }
	

       function img<%=pcounter%>(imgName) {
               if (version == "n3") {
               imgOn = eval("but<%=pcounter%>on.src");
               document [imgName].src = imgOn;               }       }
      
      
</script>

<% 
   End if
	wend
%>

<% end if %>