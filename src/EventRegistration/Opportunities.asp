<html>
<head>

<%  PageName = "Opportunities" %>
<!--#Include virtual="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= SEOTitle %> </title>
<META name="description" content="<%= SEODescription %> ">
<META name="keywords" content="<%= SEOKeyword1 %>, 
<%=SEOKeyword2%>, 
<%=SEOKeyword3 %>,
<%=SEOKeyword4 %>, 
<%=SEOKeyword5 %>, 
<%=SEOKeyword6 %>,  
<%=SEOKeyword7 %>, 
<%=SEOKeyword8 %>, 
<%=SEOKeyword9 %>, 
<%=SEOKeyword10 %>, 
<%=SEOKeyword11 %>, 
 <%=SEOKeyword12 %>, 
 <%=SEOKeyword13 %>, 
 <%=SEOKeyword14 %>, 
 <%=SEOKeyword15 %>, 
 <%=SEOKeyword16 %>, 
 <%=SEOKeyword17 %>, 
 <%=SEOKeyword18 %>, 
 <%=SEOKeyword19 %>, 
 <%=SEOKeyword20 %> ">



<meta name="author" content="The Andresen Group">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="BarnStyle.css">


<%conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
			Set rs = Server.CreateObject("ADODB.Recordset")
			
			sql = "select * from  Pagelayout where PageName = '" & PageName & "'"
				'response.write(sql)
				rs.Open sql, conn, 3, 3
				If not rs.eof then

				
					PageTitle = rs("PageTitle")
					PageHeading1= rs("PageHeading1")
					PageHeading2= rs("PageHeading2")
					PageHeading3= rs("PageHeading3")
					PageHeading4= rs("PageHeading4")
									PageHeading5= rs("PageHeading5")
													PageHeading6= rs("PageHeading6")
																	PageHeading7= rs("PageHeading7")
					PageText1 = rs("PageText")
					PageText2 = rs("PageText2")
					PageText3 = rs("PageText3")
					PageText4 = rs("PageText4")
						PageText5 = rs("PageText5")
							PageText6 = rs("PageText6")
								PageText7 = rs("PageText7")
					Image1= rs("Image1")
					Image2= rs("Image2")
					Image3= rs("Image3")
					Image4= rs("Image4")
					Image5= rs("Image5")
					Image6= rs("Image6")
					Image7= rs("Image7")
					ImageCaption1= rs("ImageCaption1")
					ImageCaption2= rs("ImageCaption2")
					ImageCaption3= rs("ImageCaption3")
					ImageCaption4= rs("ImageCaption4")
					ImageCaption5= rs("ImageCaption5")
					ImageCaption6= rs("ImageCaption6")
					ImageCaption7= rs("ImageCaption7")
					ImageOrientation1= rs("ImageOrientation1")
					ImageOrientation2= rs("ImageOrientation2")
					ImageOrientation3= rs("ImageOrientation3")
					ImageOrientation4= rs("ImageOrientation4")
								ImageOrientation5= rs("ImageOrientation5")
											ImageOrientation6= rs("ImageOrientation6")
														ImageOrientation7= rs("ImageOrientation7")

				rs.close
			End If 
			%>

<script type="text/javascript">

function addCaption( oImgElem, bUseCaptionMarker )
{
  // Insert Caption
  var oCaptionElem = document.createElement("div");
  oCaptionElem.className = "caption";

  if( bUseCaptionMarker)
  {
    var oCaptionMarkerElem = document.createElement("div");
    oCaptionMarkerElem.className = "caption-marker";
    var oCaptionMarkerTextElem = document.createTextNode("\u00bb");
    oCaptionMarkerElem.appendChild(oCaptionMarkerTextElem);
    oCaptionElem.appendChild(oCaptionMarkerElem );
  }

  var oCaptionTextElem = document.createElement("div");
  oCaptionTextElem.className = "caption-text";
  var oCaptionText = document.createTextNode( oImgElem.alt );
  oCaptionTextElem.appendChild(oCaptionText );
  oCaptionElem.appendChild(oCaptionTextElem);

  if( oImgElem.getAttribute("copyright") != null )
  {
    var oCopyrightElem = document.createElement("div");
    oCopyrightElem.className = "copyright";
    var oCopyrightText = document.createTextNode( 
      oImgElem.getAttribute("copyright") );
    oCopyrightElem.appendChild(oCopyrightText);
    oCaptionElem.appendChild(oCopyrightElem );
  }

  if(oImgElem.nextSibling) 
    oImgElem.parentNode.insertBefore(oCaptionElem,
      oImgElem.nextSibling);
  else
    oImgElem.parentNode.appendChild(oCaptionElem);

  with(oImgElem.style)
  {
    oCaptionElem.style.width = (oImgElem.width+borderLeft+
      borderRight+paddingLeft+paddingRight)+"px";
  }

  return true; 
}
</script>


</HEAD>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

<Table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" valign = "top" width = "720">
		<tr>
				<td class = "body" align ="left">
					<% If Len(PageTitle) > 1 Then %>
							<h1><%=PageTitle%></h1>
					<% Else %>
							<br><h1><%=PageName%></h1>
						<% End if %>
				</td>
			</tr>
		<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>
			<tr>
			   <td class = "body"><br>



		<table border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  width = "700" >
		     	<td  class = "body">
					
				<% If Len(Image1) > 2 then%>
						<img src = "<%=Image1%>" align = "<%=ImageOrientation1%>" width = "200" border = "1">
					<% End If %>
				<%=PageText%><br><br>

				<% If Len(Image2) > 2 then%>
						<img src = "<%=Image2%>" align = "<%=ImageOrientation2%>" width = "200"  border = "1">
					<% End If %>
				<%=PageText2%><br><br>

				<% If Len(Image3) > 2 then%>
						<img src = "<%=Image3%>" align = "<%=ImageOrientation3%>" width = "200"  border = "1">
					<% End If %>
				<%=PageText3%><br><br>

				<% If Len(Image4) > 2 then%>
						<img src = "<%=Image4%>" align = "<%=ImageOrientation4%>" width = "200"  border = "1">
					<% End If %>
				<%=PageText4%>


				
		</td>
	</tr>
</table>


	</td>
	</tr>
</table>

 <!--#Include file="Footer.asp"--> 
</body>
</html>

